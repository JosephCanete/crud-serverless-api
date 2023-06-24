"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const userTable = process.env.USER_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");

module.exports.getUser = async (event) => {
  const { id } = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: userTable,
        Key: {
          id,
        },
      })
      .promise();
    if (result.Item) {
      return successResponse(200, result.Item);
    } else {
      return errorResponse(404, `User with ID ${id} not found`);
    }
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
