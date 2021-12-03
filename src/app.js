import "./config/bootstrap";
import http from "http";
import createError from "http-errors";
import express from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import winston from "./config/winston";
import AppConf from "./config/application";
import Messages from "./config/messages";
import DB from "./config/db";
import UsersRouter from "./routes/UsersRouter";
import AuthRouter from "./routes/AuthRouter";
import { jwtStrategy } from "./config/passport";
import setupWebSocket from "./socket/setupWebSocket";

const app = express();

app.use(morgan("combined", { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");
app.use(
  cors({
    allowedOrigin: AppConf.cors.allowedOrigin,
    allowedMethods: AppConf.cors.allowedMethods,
    allowedHeaders: AppConf.cors.allowedHeaders,
    exposedHeaders: AppConf.cors.exposedHeaders,
    credentials: AppConf.cors.credentials,
  })
);

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api/auth", AuthRouter);
app.use("/api/users", UsersRouter);

app.get("/healthcheck", function (req, res) {
  res.send("healthcheck!!! BE server is up!");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const status = err.status || err.statusCode || 500;
  const message = err.message || Messages["en"].unexpected_error;

  const line = `${status} - ${req.method} - ${message} - ${req.originalUrl} - ${
    req.ip
  } - ${req.user && req.user.email}`;
  winston.error(line);
  console.log(line);
  res.status(status);
  res.json({ error: message });
});

const port = normalizePort(process.env.PORT || "8082");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
setupWebSocket(server);

mongoose.connect(DB.mongoose.url, DB.mongoose.options).then(() => {
  server.listen(port);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(Messages["en"].invalid_permission(bind));
      process.exit(1);
    case "EADDRINUSE":
      console.error(Messages["en"].port_in_use(bind));
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log(Messages["en"].started_app(bind));
}

module.exports = server;
