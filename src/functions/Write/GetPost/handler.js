"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const DEVOTION = process.env.DEVOTION_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");

module.exports.GetPost = async (event) => {
  const { id } = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: DEVOTION,
        Key: {
          id,
        },
      })
      .promise();
    if (result.Item) {
      return successResponse(200, result.Item);
    } else {
      return errorResponse(404, `User with ID ${userId} not found`);
    }
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
