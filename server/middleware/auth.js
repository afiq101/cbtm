import jwt from "jsonwebtoken";

const ENV = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const cookies = event.req.headers.cookie;
    if (!cookies) throw new Error("Cookie not found");

    let { accessToken, refreshToken, user } = parseCookie(cookies);

    if (!accessToken) accessToken = null;
    if (!refreshToken) refreshToken = null;

    let { subdomain } = JSON.parse(user);
    if (!subdomain) subdomain = null;

    let payloadUser = null;

    payloadUser = verifyAccessToken(accessToken);

    if (!payloadUser) {
      payloadUser = verifyRefreshToken(refreshToken);
      if (!payloadUser) throw new Error("Unauthorized Refresh Token");

      const accessToken = generateAccessToken({
        email: payloadUser.email,
        roles: payloadUser.roles,
      });

      // Set new access token
      event.res.setHeader("Set-Cookie", [
        `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      ]);
    }

    const getUser = await getUserInfo(payloadUser.username);
    if (!getUser) throw new Error("User not found");

    const getOrganization = await getOrganizationInfo(getUser.organization);

    event.context.user = {
      userID: getUser.user_id || null,
      email: payloadUser.email || null,
      roles: payloadUser.roles || [],
      organization: getOrganization || null,
    };

    return;
  } catch (error) {
    // console.log(error.message);
    event.context.user = {
      userID: null,
      email: null,
      roles: [],
    };
    return;
  }
});

function parseCookie(str) {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

function verifyAccessToken(accessToken) {
  try {
    const token = ENV.auth.secretAccess;
    return jwt.verify(accessToken, token);
  } catch (error) {
    console.log("Error verifying access token:", error);
    return false;
  }
}

function verifyRefreshToken(refreshToken) {
  try {
    const token = ENV.auth.secretRefresh;
    return jwt.verify(refreshToken, token);
  } catch (error) {
    console.log("Error verifying refresh token:", error);
    return false;
  }
}

function generateAccessToken(user) {
  try {
    const token = ENV.auth.secretAccess;
    return jwt.sign(user, token, { expiresIn: "1d" });
  } catch (error) {
    return false;
  }
}

async function getUserInfo(username) {
  console.log("Username:", username);

  try {
    const user = await prisma.user.findFirst({
      where: {
        user_username: username,
      },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getOrganizationInfo(userID) {
  try {
    const organization = await prisma.organization.findFirst({
      where: {
        user_organization: {
          some: {
            uo_user_id: userID,
          },
        },
      },
      select: {
        org_id: true,
        org_name: true,
      },
    });

    if (!organization) return null;

    return organization;
  } catch (error) {
    console.log(error);

    return null;
  }
}
