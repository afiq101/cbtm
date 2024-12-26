export default defineEventHandler(async (event) => {
  try {
    const { name, description } = await readBody(event);

    console.log(event.context.user);
    console.log(name);
    console.log(description);

    if (!name) {
      return {
        statusCode: 400,
        message: "Name is required",
      };
    }

    if (!description) {
      return {
        statusCode: 400,
        message: "Description is required",
      };
    }

    // Check if group exist under the user's organization
    const group = await prisma.group.findFirst({
      where: {
        group_org_id: event.context.user.organization.org_id,
        group_name: name,
      },
    });

    if (group) {
      return {
        statusCode: 400,
        message: "Group already exists",
      };
    }

    // Create group
    const newGroup = await prisma.group.create({
      data: {
        group_org_id: event.context.user.organization.org_id,
        group_name: name,
        group_description: description,
        group_status: 1,
        group_created_at: new Date(),
        group_modified_by: event.context.user.user_id,
      },
    });

    return {
      statusCode: 200,
      message: "Group created successfully",
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
