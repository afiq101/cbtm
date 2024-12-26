export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all user under user's id
    const superuser = await prisma.user.findMany({
      where: {
        user_type: 3,
      },
    });

    let result = [];

    for (let index = 0; index < superuser.length; index++) {
      const element = superuser[index];

      // Get organization name
      const organization = await prisma.organization.findFirst({
        where: {
          user_organization: {
            some: {
              uo_user_id: element.user_id
            }
          }
        },
      });

      result.push({
        ...element,
        organization: organization.org_name,
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
