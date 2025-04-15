import { logger } from "./logger";

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    status: err.status || 500,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};
