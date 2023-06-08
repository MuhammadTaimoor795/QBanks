const success = (results, statusCode) => {
  return {
    data: results,
    success: true,
    code: statusCode,
  };
};

const errorResponse = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 409, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    error: message.replace(/[^=' :.,a-zA-Z0-9]/g, ""),
    code: statusCode,
    success: false,
  };
};

const validation = (error) => {
  return {
    error: error.replace(/[^=' :.,a-zA-Z0-9]/g, ""),
    success: false,
    code: 422,
  };
};

const Notifications = {
  marketplace: {
    Offer_Accept_Type: "Offer",
    Offer_Accept_Title: "Offer Accepted",
    Offer_Accept_Description: "Your Offer is Accepted ",
  },
  // update: Joi.object({
  //   gems: Joi.number().optional(),
  //   price: Joi.number().optional(),
  //   type: Joi.string().optional(),
  // }),
};

const TestStatus = Object.freeze({
  // PENDING: "PENDING",
  // PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  INCOMPLETED: "INCOMPLETED",
  PAUSE: "PAUSE",

  // FAILED: "FAILED",
});

module.exports = {
  validation,
  errorResponse,
  success,
  TestStatus,
};
