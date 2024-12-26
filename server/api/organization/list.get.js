export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all user under user's id
    const organizations = await prisma.organization.findMany();

    let result = [];

    for (let index = 0; index < organizations.length; index++) {
      const element = organizations[index];

      // Get total groups under organization
      const groups = await prisma.group.findMany({
        where: {
          group_org_id: element.org_id,
        },
      });

      console.log("Total groups: ", groups.length);

      // Get total users under organization
      // const users = await prisma.user.findMany({
      //   where: {
      //     user_org_id: element.org_id,
      //   },
      // });

      result.push({
        ...element,
        groups: groups.length,
        // users: users.length,
      });
    }

    return {
      statusCode: 200,
      message: "Organization fetched successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
