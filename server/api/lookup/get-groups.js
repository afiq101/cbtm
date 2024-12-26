export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    let groups = null;

    groups = await prisma.group.findMany({
      where: {
        group_org_id: event.context.user.organization.org_id,
      },
    });

    return {
      statusCode: 200,
      data: groups,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      message: "Server error",
    };
  }
});
