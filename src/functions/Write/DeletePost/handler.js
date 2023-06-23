"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const DEVOTION = process.env.DEVOTION_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const { isExisting } = require("../../../utilities/ddbUtils/isExisting");

module.exports.DeletePost = async (event) => {
  const { id } = event.pathParameters;
  const isValidPost = await isExisting(DEVOTION, { id });
  if (typeof boolean && !isValidPost)
    return errorResponse(404, `POST ID OF ${id} NOT FOUND!`);
  if (isValidPost?.error)
    return errorResponse(isValidPost.statusCode, isValidPost.error);

  try {
    await dynamodb
      .delete({
        TableName: DEVOTION,
        Key: {
          id,
        },
      })
      .promise();

    return successResponse(200, {
      message: `Post has successfully deleted.`,
      id,
    });
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
