"use strict";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

async function isExisting(tableName, key) {
  const parameter = {
    TableName: tableName,
    Key: { ...key },
  };
  let user;
  try {
    user = await dynamodb.get(parameter).promise();
  } catch (error) {
    console.log("what is error here", error);
    return {
      statusCode: 400,
      error: "Something went wrong while finding the data",
    };
  }

  if (!user || !user.Item) {
    // User not found
    return false;
  }
  return true;
}

module.exports = { isExisting };
