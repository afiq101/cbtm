export default defineEventHandler(async (event) => {
  try {
    const { groupId, members } = await readBody(event);

    console.log(groupId);
    console.log(members);

    // Check if group exist under the user's organization
    const group = await prisma.group.findFirst({
      where: {
        group_id: parseInt(groupId),
      },
    });

    if (!group) {
      return {
        statusCode: 400,
        message: "Group not found",
      };
    }

    for (const member of members) {
      // Check if user exist
      const user = await prisma.user.findFirst({
        where: {
          user_id: member,
        },
      });

      if (!user) {
        // Skip if user not found
        continue;
      }

      // Check if user already exist in the group
      const userGroup = await prisma.user_group.findFirst({
        where: {
          ug_group_id: parseInt(groupId),
          ug_user_id: member,
        },
      });

      if (userGroup) {
        // Skip if user already exist in the group
        continue;
      }

      // Add user to the group
      await prisma.user_group.create({
        data: {
          ug_group_id: parseInt(groupId),
          ug_user_id: parseInt(member),
          ug_status: 1,
          ug_created_at: new Date(),
          ug_modified_by: event.context.user.user_id,
        },
      });
    }

    return {
      statusCode: 200,
      message: "Members added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
