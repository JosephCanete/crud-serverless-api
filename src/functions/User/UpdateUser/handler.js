"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const userTable = process.env.USER_TABLE;
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");

module.exports.updateUser = async (event) => {
  const { id } = event.pathParameters;
  const { username, role, lastName, address, firstName, middleName, age } =
    JSON.parse(event.body);

  try {
    const { Attributes } = await dynamodb
      .update({
        TableName: userTable,
        Key: {
          id,
        },
        UpdateExpression:
          "set #role = :role, lastName = :lastName, address = :address, firstName = :firstName, middleName = :middleName, age = :age, username = :username",
        ExpressionAttributeNames: {
          "#role": "role",
        },
        ExpressionAttributeValues: {
          ":username": username,
          ":role": role,
          ":lastName": lastName,
          ":address": address,
          ":firstName": firstName,
          ":middleName": middleName,
          ":age": age,
        },
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
