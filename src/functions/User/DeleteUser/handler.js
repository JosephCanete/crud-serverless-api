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
  const { id } = event.pathParameters;
  const isValidUser = await isExisting(userTable, { id });
  if (typeof boolean && !isValidUser)
    return errorResponse(404, `User ID of ${id} not found`);
  if (isValidUser?.error)
    return errorResponse(isValidUser.statusCode, isValidUser.error);

  try {
    await dynamodb
      .delete({
        TableName: userTable,
        Key: {
          id,
        },
      })
      .promise();

    return successResponse(200, {
      message: `User has successfully deleted.`,
      id,
    });
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
