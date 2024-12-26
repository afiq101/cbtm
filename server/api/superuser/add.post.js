import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
  try {
    const { name, email, organizationId } = await readBody(event);

    console.log(name, email, organizationId);

    console.log(event.context.user);

    if (!name || !email || !organizationId) {
      return {
        statusCode: 400,
        message: "Missing required fields",
      };
    }

    const organization = await prisma.organization.findFirst({
      where: {
        org_id: organizationId,
      },
    });

    if (!organization) {
      return {
        statusCode: 400,
        message: "Organization not found",
      };
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        user_email: email,
        user_username: name,
        user_type: 3,
        user_password: sha256("abc123").toString(),
        user_status: 1,
        user_created_at: new Date(),
        user_modified_by: event.context.user.userID,
      },
    });

    // Create user organization
    const userOrganization = await prisma.user_organization.create({
      data: {
        uo_user_id: user.user_id,
        uo_org_id: organization.org_id,
        uo_status: 1,
      },
    });

    return {
      statusCode: 200,
      message: "Superuser created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
