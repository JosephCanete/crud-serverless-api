"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const DEVOTION = process.env.DEVOTION_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const { checkPayload } = require("../../../utilities/validation");
const { GenerateDate, GenerateUUID } = require("../../../utilities/helper");

module.exports.CreatePost = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { title, content } = requestBody;
  const payload = {
    id: GenerateUUID(),
    createdAt: GenerateDate(),
    updatedAt: GenerateDate(),
    title,
    content,
  };

  const missingFields = checkPayload({ title, content }, requestBody);

  if (missingFields.length > 0)
    return errorResponse(400, {
      message: "Some fields are missing",
      missingFields,
    });
  try {
    await dynamodb
      .put({
        TableName: DEVOTION,
        Item: payload,
      })
      .promise();

    return successResponse(201, payload);
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
