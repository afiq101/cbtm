import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
  try {
    const { name, email, role, group } = await readBody(event);

    console.log(event.context.user);

    if (!name || !email || !role || !group) {
      return {
        statusCode: 400,
        message: "Name is required",
      };
    }

    const user = await prisma.user.create({
      data: {
        user_username: name,
        user_password: sha256("abc123").toString(),
        user_email: email,
        user_type: parseInt(role),
        user_superuser_id: event.context.user.userID,
        user_status: 1,
        user_created_at: new Date(),
        user_modified_by: event.context.user.userID,
      },
    });

    const userGroup = await prisma.user_group.create({
      data: {
        ug_user_id: user.user_id,
        ug_group_id: parseInt(group),
        ug_status: 1,
        ug_created_at: new Date(),
        ug_modified_by: event.context.user.userID,
      },
    });

    return {
      statusCode: 200,
      message: "User created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
