import sha256 from "crypto-js/sha256.js";
import jwt from "jsonwebtoken";

const ENV = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event);

    if (!username || !password) {
      return {
        statusCode: 400,
        message: "Username and password are required",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        user_username: username,
      },
    });

    if (!user) {
      return {
        statusCode: 404,
        message: "User does not exist",
      };
    }

    const hashedPassword = sha256(password).toString();
    if (user.user_password !== hashedPassword) {
      return {
        statusCode: 401,
        message: "Invalid password",
      };
    }

    // Get user roles
    const roles = await prisma.role.findMany({
      where: {
        role_id: user.user_type,
      },
      select: {
        role_name: true,
      },
    });

    const roleNames = roles.map((r) => r.role_name);

    let organization = null;

    if (roleNames.includes("admin") || roleNames.includes("developer")) {
      // If superuser, get direct organization from user_organization table
      organization = {
        org_name: "CBTM",
        org_email: "cbtm@cbtm.com",
      };
    } else if (roleNames.includes("superuser")) {
      // If superuser, get direct organization from user_organization table
      organization = await prisma.organization.findFirst({
        where: {
          user_organization: {
            some: {
              uo_user_id: user.user_id,
            },
          },
        },
      });
    } else {
      // If not superuser, get superuser id, then get organization from user_organization table
      const superuser = await prisma.user.findFirst({
        where: {
          user_id: user.user_id,
        },
        select: {
          user_superuser_id: true,
        },
      });

      organization = await prisma.organization.findFirst({
        where: {
          user_organization: {
            some: {
              uo_user_id: superuser.user_superuser_id,
            },
          },
        },
      });
    }

    const accessToken = generateAccessToken({
      username: user.user_username,
      roles: roleNames,
    });

    const refreshToken = generateRefreshToken({
      username: user.user_username,
      roles: roleNames,
    });

    // Set cookie httpOnly
    event.res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
    ]);

    return {
      statusCode: 200,
      message: "Login success",
      data: {
        username: user.user_username,
        roles: roleNames,
        organization: {
          name: organization.org_name,
          email: organization.org_email,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, ENV.auth.secretAccess, { expiresIn: "1d" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, ENV.auth.secretRefresh, { expiresIn: "30d" });
}
