export default defineEventHandler(async (event) => {
  try {
    console.log(event.context.user);

    let organizations = null;

    organizations = await prisma.organization.findMany();

    return {
      statusCode: 200,
      data: organizations,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      message: "Server error",
    };
  }
});
