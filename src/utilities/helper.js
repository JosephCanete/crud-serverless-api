const uuid = require("node-uuid");
const moment = require("moment");
const axios = require("axios");

const currentDate = moment();
const GenerateDate = () => currentDate.format("MMMM D, YYYY h:mm A");
const GenerateUUID = () => uuid.v4();
const GeneratePolicy = (principalId, effect, resource) => {
  const policy = {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
  return policy;
};

const GenerateCognitoPublicKey = async (tokenKeyId) => {
  try {
    const jwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_COGNITO_POOL_ID}/.well-known/jwks.json`;
    const response = await axios.get(jwksUrl);
    const { keys } = response.data;
    // Find the appropriate Cognito public key based on the token's key ID (kid)
    const cognitoPublicKey = keys.find((key) => key.kid === tokenKeyId);
    if (!cognitoPublicKey) {
      throw new Error("Cognito public key not found for the given key ID.");
    }
    return cognitoPublicKey;
  } catch (error) {
    console.error("Failed to fetch Cognito public key:", error);
    throw error;
  }
};

export { GenerateDate, GenerateUUID, GeneratePolicy, GenerateCognitoPublicKey };
