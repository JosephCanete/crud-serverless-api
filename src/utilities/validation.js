"use strict";
function checkPayload(expectedPayload, requestPayload) {
  const missingFields = [];
  for (const key of Object.keys(expectedPayload)) {
    if (!requestPayload.hasOwnProperty(key) || !requestPayload[key]) {
      missingFields.push(key);
    }
  }
  return missingFields;
}

module.exports = { checkPayload };
