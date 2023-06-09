"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const uuid = require("node-uuid");
const userTable = process.env.USER_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const { checkPayload } = require("../../../utilities/validation");

module.exports.createUser = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { username, firstName, middleName, lastName, age, address, role } =
    requestBody;
  const payload = {
    userId: uuid.v4(),
    createdAt: new Date().toISOString(),
    username,
    firstName,
    middleName,
    lastName,
    age,
    address,
    role,
  };

  const missingFields = checkPayload(
    { username, firstName, middleName, lastName, age, address, role },
    requestBody
  );

  if (missingFields.length > 0)
    return errorResponse(400, {
      message: "Some fields are missing",
      missingFields,
    });
  try {
    await dynamodb
      .put({
        TableName: userTable,
        Item: payload,
      })
      .promise();

    return successResponse(201, payload);
  } catch (error) {
    return errorResponse(error.statusCode, error.message);
  }
};
