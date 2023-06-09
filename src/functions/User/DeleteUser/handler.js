"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const userTable = process.env.USER_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const { isExisting } = require("../../../utilities/ddbUtils/isExisting");

module.exports.deleteUser = async (event) => {
  const userId = event.pathParameters.userId;
  const isValidUser = await isExisting(userTable, { userId });
  if (typeof boolean && !isValidUser)
    return errorResponse(404, `User ID of ${userId} not found`);
  if (isValidUser?.error)
    return errorResponse(isValidUser.statusCode, isValidUser.error);

  try {
    await dynamodb
      .delete({
        TableName: userTable,
        Key: {
          userId,
        },
      })
      .promise();

    return successResponse(200, {
      message: `User has successfully deleted.`,
      userId,
    });
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
