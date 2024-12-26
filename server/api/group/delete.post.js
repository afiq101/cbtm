export default defineEventHandler(async (event) => {
  try {
    const { groupId } = await readBody(event);

    console.log("GROUP ID", groupId);

    // Delete user group first
    await prisma.user_group.deleteMany({
      where: {
        ug_group_id: groupId,
      },
    });

    // Delete group
    await prisma.group.delete({
      where: {
        group_id: groupId,
      },
    });

    return {
      statusCode: 200,
      message: "Group deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
