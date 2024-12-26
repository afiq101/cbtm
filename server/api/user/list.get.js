export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all user under user's id
    const users = await prisma.user.findMany({
      where: {
        user_superuser_id: event.context.user.userID,
      },
      include: {
        role: true,
      },
    });

    return {
      statusCode: 200,
      message: "User fetched successfully",
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
