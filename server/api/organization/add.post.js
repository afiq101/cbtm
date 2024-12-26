import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
  try {
    const { name, email, status } = await readBody(event);

    console.log(name, email, status);

    console.log(event.context.user);

    if (!name || !email || !status) {
      return {
        statusCode: 400,
        message: "Missing required fields",
      };
    }

    // check if email is already in use
    const checkEmail = await prisma.organization.findFirst({
      where: {
        org_email: email,
      },
    });

    if (checkEmail) {
      return {
        statusCode: 400,
        message: "Organization email is already exists.",
      };
    }

    const organization = await prisma.organization.create({
      data: {
        org_name: name,
        org_email: email,
        org_status: status === "Active" ? 1 : 0,
        org_created_at: new Date(),
        org_modified_by: event.context.user.userID,
      },
    });

    return {
      statusCode: 200,
      message: "Organization created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
