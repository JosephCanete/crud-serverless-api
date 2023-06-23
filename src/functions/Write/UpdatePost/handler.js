"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const DEVOTION = process.env.DEVOTION_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const { GenerateDate } = require("../../../utilities/helper");
const { isExisting } = require("../../../utilities/ddbUtils/isExisting");

module.exports.UpdatePost = async (event) => {
  const { id } = event.pathParameters;
  const { title, content } = JSON.parse(event.body);
  const isValidPost = await isExisting(DEVOTION, { id });
  if (typeof boolean && !isValidPost)
    return errorResponse(404, `POST ID OF ${id} NOT FOUND!`);
  if (isValidPost?.error)
    return errorResponse(isValidPost.statusCode, isValidPost.error);

  try {
    const { Attributes } = await dynamodb
      .update({
        TableName: DEVOTION,
        Key: {
          id,
        },
        ExpressionAttributeValues: {
          ":title": title,
          ":content": content,
          ":updateAt": GenerateDate(),
        },
        UpdateExpression:
          "set title = :title, content = :content, updateAt = :updateAt",
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return successResponse(200, {
      data: Attributes,
      message: "User Successfully Updated.",
    });
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
