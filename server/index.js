const express = require("express");
const helmet = require("helmet");
const app = express();
const { infoLogger, errorLogger } = require("./utils/logger");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Apply the rate limiter to all requests
app.use(limiter);
const port = 4000;
app.use(helmet());
app.use(helmet.xssFilter());

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const referrer = req.headers["referer"] || req.headers["referrer"];
  const requestId = uuidv4();
  const start = process.hrtime();

  // Attach requestId to the request (optional, good for tracing)
  req.requestId = requestId;

  res.on("finish", () => {
    const [sec, nano] = process.hrtime(start);
    const responseTimeMs = (sec * 1000 + nano / 1e6).toFixed(2);

    infoLogger.info(
      {
        timestamp: new Date().toISOString(),
        ip,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        userAgent,
        user: req?.user?.username || "Guest",
        responseTimeMs,
        referrer,
        requestId,
        query: req.query,
        body: req.method !== "GET" ? req.body : undefined,
      },
      "User request log"
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use((req, res) => {
  try {
    if (new Url(req.query.url).host !== "example.com") {
      return res
        .status(400)
        .end(`Unsupported redirect to host: ${req.query.url}`);
    }
  } catch (e) {
    return res.status(400).end(`Invalid url: ${req.query.url}`);
  }
  res.redirect(req.query.url);
});
// Global error handler
app.use((err, req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const referrer = req.headers["referer"] || req.headers["referrer"];
  const requestId = req.requestId || uuidv4();

  errorLogger.error(
    {
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      url: req.originalUrl,
      userAgent,
      referrer,
      user: req?.user?.username || "Guest",
      statusCode: res.statusCode || 500,
      requestId,
      query: req.query,
      body: req.method !== "GET" ? req.body : undefined,
      message: err.message,
      stack: err.stack,
    },
    "Unhandled error"
  );

  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
