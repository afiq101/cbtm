export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    // Get all user under user's id
    const organizations = await prisma.organization.findMany();

    return {
      statusCode: 200,
      message: "Organization fetched successfully",
      data: organizations,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
