const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes/index");
const env = require("./config/env");

const app = express();

// Global Middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Development Logging Configuration
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Central API route mounting point
app.use("/api", routes);

// Centralized Error Handling Middlewares (Must be last)
app.use(errorHandler);

module.exports = app;
