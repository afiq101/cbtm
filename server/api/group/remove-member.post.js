export default defineEventHandler(async (event) => {
  try {
    const { groupId, member } = await readBody(event);

    console.log(groupId);
    console.log(member);

    // Get ug id
    const ug = await prisma.user_group.findFirst({
      where: {
        ug_group_id: parseInt(groupId),
        ug_user_id: parseInt(member),
      },
    });

    console.log("UG:", ug);

    await prisma.user_group.delete({
      where: {
        ug_id: ug.ug_id,
      },
    });

    return {
      statusCode: 200,
      message: "Member removed successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
