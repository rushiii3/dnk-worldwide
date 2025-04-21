const ThrowError = (message, statusCode) => {
    let error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  };
module.exports = ThrowError;