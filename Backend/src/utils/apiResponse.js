// This is a utility function to send a success response
const success = (res, data, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

// this is an error response function
const error = (res, message = "Request failed", statusCode = 500, details) =>
  res.status(statusCode).json({ success: false, message, ...(details ? { details } : {}) });

module.exports = { success, error };