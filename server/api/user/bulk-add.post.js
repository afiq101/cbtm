import { read, utils } from "xlsx";
import sha256 from "crypto-js/sha256.js";
import formidable from "formidable";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    console.log("EVENT:", event);

    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(event.req);

    if (!files.file?.[0]) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded",
      });
    }

    const file = files.file[0];

    // Read Excel file
    const workbook = read(file.filepath, { type: "file" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(worksheet);

    // Validate data structure
    if (!data.length) {
      throw createError({
        statusCode: 400,
        message: "File is empty",
      });
    }

    const requiredColumns = ["username", "email"];
    const headers = Object.keys(data[0]);

    for (const column of requiredColumns) {
      if (!headers.includes(column)) {
        throw createError({
          statusCode: 400,
          message: `Missing required column: ${column}`,
        });
      }
    }

    // Process each row
    const results = await prisma.$transaction(async (prisma) => {
      const createdUsers = [];

      for (const row of data) {
        // Validate role and group existence
        const role = await prisma.role.findFirst({
          where: { role_name: row.role },
        });

        const group = await prisma.group.findFirst({
          where: { group_name: row.group },
        });

        if (!role || !group) {
          throw createError({
            statusCode: 400,
            message: `Invalid role or group for user: ${row.name}`,
          });
        }

        // Create user
        const user = await prisma.user.create({
          data: {
            user_username: row.username,
            user_password: sha256("abc123").toString(),
            user_email: row.email,
            user_type: role.role_id,
            user_superuser_id: event.context.user.userID,
            user_status: 1,
            user_created_at: new Date(),
            user_modified_by: event.context.user.userID,
          },
        });

        createdUsers.push(user);
      }

      return createdUsers;
    });

    return {
      statusCode: 200,
      message: `Successfully created ${results.length} users`,
      data: results,
    };
  } catch (error) {
    console.error("Bulk upload error:", error);
    return {
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    };
  }
});
