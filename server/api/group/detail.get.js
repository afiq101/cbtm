export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all group under user's organization
    const groups = await prisma.group.findFirst({
      where: {
        group_id: event.context.params.groupId,
      },
    });

    const members = await prisma.user_group.findMany({
      where: {
        ug_group_id: event.context.params.groupId,
      },
    });

    const membersData = [];

    for (const member of members) {
      const user = await prisma.user.findFirst({
        where: {
          user_id: member.ug_user_id,
        },
      });

      // Get role
      const role = await prisma.role.findFirst({
        where: {
          role_id: user.user_type,
        },
      });

      membersData.push({
        user_id: user.user_id,
        user_username: user.user_username,
        user_email: user.user_email,
        user_role: role.role_name,
      });
    }

    return {
      statusCode: 200,
      message: "Group fetched successfully",
      data: {
        group: groups,
        members: membersData,
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
