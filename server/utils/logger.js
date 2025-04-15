const fs = require("fs");
const path = require("path");
const pino = require("pino");

// Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Info logger (logs to console and file)
const infoLogger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
        level: "info",
      },
      {
        target: "pino/file",
        options: { destination: path.join(logDir, "app.log") },
        level: "info",
      },
    ],
  },
});

// Error logger (logs only to file)
const errorLogger = pino(
  {
    level: "error",
  },
  pino.destination(path.join(logDir, "error.log"))
);

module.exports = { infoLogger, errorLogger };
