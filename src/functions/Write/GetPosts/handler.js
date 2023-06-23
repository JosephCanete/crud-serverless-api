"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const DEVOTION = process.env.DEVOTION_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");

module.exports.GetPosts = async () => {
  try {
    const { Items } = await dynamodb
      .scan({
        TableName: DEVOTION,
      })
      .promise();
    return successResponse(200, Items);
  } catch (error) {
    console.log(error);
    return errorResponse(error.statusCode, error.message);
  }
};
