require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
const { infoLogger, errorLogger } = require("./utils/logger");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
const { connectToMongoDB, disconnectFromMongoDB } = require('./utils/MongoConnect');
const server = app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);

  try {
    await connectToMongoDB();
  } catch (err) {
    server.close(() => {
      console.log("❌ Server closed due to MongoDB connection failure");
      process.exit(1);
    });
  }
});
const userRoute = require("./Routes/userRoute");
// Apply the rate limiter to all requests
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
    credentials: true,
  })
);
app.use(helmet());
app.use(helmet.xssFilter());

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "PRODUCTION") {
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
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1/user", userRoute);
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
  if (process.env.NODE_ENV === "PRODUCTION") {
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
        // message: err.message,
        stack: err.stack,
      },
      "Unhandled error"
    );
  }

  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});
// Graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  server.close(async () => {
    console.log('🛑 Server closed');
    await disconnectFromMongoDB();
    process.exit(0);
  });
}
