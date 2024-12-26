export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    let roles = null;

    // If roles is superuser, then get roles above from superuser role id
    if (event.context.user.roles.includes("superuser")) {
      roles = await prisma.role.findMany({
        where: {
          role_id: {
            gt: 3,
          },
        },
      });
    } else {
      roles = await prisma.role.findMany();
    }

    return {
      statusCode: 200,
      data: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      message: "Server error",
    };
  }
});
