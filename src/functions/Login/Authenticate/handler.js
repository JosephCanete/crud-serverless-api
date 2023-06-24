const AWS = require("aws-sdk");
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const {
  successResponse,
  errorResponse,
} = require("../../../utilities/responseBuilder");
const USER_COGNITO_CLIENT_ID = process.env.USER_COGNITO_CLIENT_ID;

module.exports.LoginUser = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: USER_COGNITO_CLIENT_ID,
    // UserPoolId: USER_COGNITO_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .initiateAuth(params)
      .promise();

    return successResponse(200, {
      message: `Sucessfully login user ${username}.`,
      ...result,
    });
  } catch (error) {
    console.log(error);
    const { message } = error;
    return errorResponse(401, message);
  }
};
