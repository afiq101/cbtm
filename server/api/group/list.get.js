export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all group under user's organization
    const groups = await prisma.group.findMany({
      where: {
        group_org_id: event.context.user.organization.org_id,
      },
    });

    let fetchedGroups = [];

    for (let index = 0; index < groups.length; index++) {
      console.log(groups[index]);

      // Get count user in each group
      const members = await prisma.user_group.findMany({
        where: {
          ug_group_id: groups[index].group_id,
        },
      });

      console.log("Members", members);

      fetchedGroups.push({
        id: groups[index].group_id,
        name: groups[index].group_name,
        description: groups[index].group_description,
        members: members.length,
      });
    }

    return {
      statusCode: 200,
      message: "Group fetched successfully",
      data: fetchedGroups,
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
