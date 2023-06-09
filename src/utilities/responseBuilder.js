const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function successResponse(statusCode, data) {
  return {
    headers,
    statusCode: statusCode,
    body: JSON.stringify(data),
  };
}

function errorResponse(statusCode, errorMessage) {
  return {
    headers,
    statusCode: statusCode,
    body: JSON.stringify({ message: errorMessage }),
  };
}

module.exports = { successResponse, errorResponse };
