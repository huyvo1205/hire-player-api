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
import { jwtStrategy } from "./config/passport";
import setupWebSocket from "./socket/setupWebSocket";
import routes from "./routes";
import Swagger from "./swagger/swaggerConfig";
import HandlerErrorMiddleware from "./middlewares/HandlerErrorMiddleware";

global.logger = winston;

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
const port = normalizePort(process.env.PORT || "8082");

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
Swagger.setupSwagger(app);
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.get("/healthcheck", (req, res) => {
  res.send("healthcheck!!! BE server is up!");
});

app.use("/api", routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(HandlerErrorMiddleware.errorMiddleware);

app.set("port", port);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.error(Messages.en.invalid_permission(bind));
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(Messages.en.port_in_use(bind));
      process.exit(1);
      break;
    default:
      throw error;
  }
}
const server = http.createServer(app);

server.on("error", onError);
server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(Messages.en.started_app(bind));
});

setupWebSocket(server);

mongoose.connect(DB.mongoose.url, DB.mongoose.options).then(() => {
  server.listen(port);
});

module.exports = server;
