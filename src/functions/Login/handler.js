const AWS = require("aws-sdk");
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const {
  successResponse,
  errorResponse,
} = require("../../utilities/responseBuilder");

module.exports.loginUser = async (event) => {
  const { username, password } = JSON.parse(event.body);

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: "2uo0jljm1jm9k7uc99fjrpqbjk",
    UserPoolId: "ap-southeast-1_q2uCkeEsz",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminInitiateAuth(params)
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
