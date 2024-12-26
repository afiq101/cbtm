export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get user under superuser
    const users = await prisma.user.findMany({
      where: {
        user_superuser_id: event.context.user.userID,
      },
    });

    return {
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
