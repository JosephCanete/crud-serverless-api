import {
  GeneratePolicy,
  GenerateCognitoPublicKey,
} from "../../utilities/helper";

const jwt = require("jsonwebtoken");

module.exports.authorizer = async (event, context) => {
  // Retrieve the Authorization header from the incoming request
  const authorizationHeader = event.headers.Authorization;
  // Extract the token from the "Authorization" header
  const token = authorizationHeader ? authorizationHeader.split(" ")[1] : null;
  // Perform your token validation logic here
  try {
    // Verify and decode the token using the Cognito JWT verification process
    const COGNITO_PUBLIC_KEY = GenerateCognitoPublicKey(token)
      .then((cognitoPublicKey) => cognitoPublicKey)
      .catch(() => null);
    const decodedToken = jwt.verify(token, COGNITO_PUBLIC_KEY);
    console.log({ responseAuthorizer: decodedToken });
    // Optionally, you can perform additional checks on the decoded token,
    // such as checking the issuer (iss), audience (aud), or custom claims.
    // Authorized
    // return GeneratePolicy(decodedToken.username, "Allow", event.methodArn);
  } catch (error) {
    console.log({ responseAuthorizerErr: error });
    // Token validation failed or expired
    // console.error("Token validation failed:", error);
    // Not authorized
    // return GeneratePolicy(null, "Deny", event.methodArn);
  }
};
