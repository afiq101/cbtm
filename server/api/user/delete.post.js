export default defineEventHandler(async (event) => {
  try {
    const { userId } = await readBody(event);

    console.log("USER ID", userId);

    // Delete all user groups

    const groups = await prisma.user_group.findMany({
      where: {
        ug_user_id: userId,
      },
    });

    console.log("GROUPS", groups);

    for (const group of groups) {
      await prisma.user_group.delete({
        where: {
          ug_id: group.ug_id,
        },
      });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        user_id: userId,
      },
    });

    return {
      statusCode: 200,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
