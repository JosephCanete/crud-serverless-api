const AWS = require("aws-sdk");
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const USER_COGNITO_CLIENT_ID = process.env.USER_COGNITO_CLIENT_ID;

module.exports.ReAuthenticateUser = async (event) => {
  const { refreshToken } = JSON.parse(event.body);

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: USER_COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .initiateAuth(params)
      .promise();

    return successResponse(200, {
      message: "Successfully refreshed token.",
      ...result,
    });
  } catch (error) {
    console.log(error);
    const { message } = error;
    return errorResponse(401, message);
  }
};
