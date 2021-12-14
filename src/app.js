import "./config/bootstrap"
import http from "http"
import express from "express"
import path from "path"
import morgan from "morgan"
import cors from "cors"
import passport from "passport"
import mongoose from "mongoose"
import winston from "./config/winston"
import AppConf from "./config/application"
import Messages from "./config/messages"
import { jwtStrategy } from "./config/passport"
import setupWebSocket from "./socket/setupWebSocket"
import routes from "./routes"
import Swagger from "./swagger/swaggerConfig"
import HandlerErrorMiddleware from "./middlewares/HandlerErrorMiddleware"
import Database from "./database"

global.logger = winston
global.baseDir = __dirname

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (Number.isNaN(port)) {
        return val
    }

    if (port >= 0) {
        return port
    }

    return false
}
const port = normalizePort(process.env.PORT || "3000")

const app = express()
if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: winston.stream }))
} else {
    app.use(morgan("dev"))
}
app.use(express.json())
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.urlencoded({ extended: false }))
app.disable("x-powered-by")
app.use(
    cors({
        allowedOrigin: AppConf.cors.allowedOrigin,
        allowedMethods: AppConf.cors.allowedMethods,
        allowedHeaders: AppConf.cors.allowedHeaders,
        exposedHeaders: AppConf.cors.exposedHeaders,
        credentials: AppConf.cors.credentials
    })
)
Swagger.setupSwagger(app)
app.use(passport.initialize())
passport.use("jwt", jwtStrategy)

app.get("/healthcheck", (req, res) => {
    res.send("healthcheck!!! BE server is up!")
})
app.set("port", port)
app.use("/api", routes)
app.use(HandlerErrorMiddleware.errorMiddleware)

function onError(error) {
    if (error.syscall !== "listen") {
        throw error
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`
    switch (error.code) {
        case "EACCES":
            console.error(Messages.en.invalid_permission(bind))
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(Messages.en.port_in_use(bind))
            process.exit(1)
            break
        default:
            throw error
    }
}
const server = http.createServer(app)

server.on("error", onError)
server.on("listening", () => {
    const addr = server.address()
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`
    console.log(Messages.en.started_app(bind))
})

setupWebSocket(server)
console.log("Database.MONGO_OPTIONS", Database.MONGO_OPTIONS)
console.log("Database.URL", Database.URL)
mongoose.connect(Database.URL, Database.MONGO_OPTIONS, err => {
    server.listen(port)
    if (err) {
        console.error("Connect database Err:", err)
        console.log("Connect to database fail!")
    } else {
        console.log("Connect database Success!")
    }
})

function shutdown() {
    server.close(err => {
        if (err) {
            console.error("SHUTDOWN ERROR", err)
            process.exitCode = 1
        }
        process.exit()
    })
}

process.on("uncaughtException", exception => {
    console.error(exception)
})

process.on("unhandledRejection", reason => {
    console.error(reason.stack || reason)
})

process.on("SIGINT", () => {
    console.error("Got SIGINT (aka ctrl-c in docker). Graceful shutdown")
    shutdown()
})

process.on("SIGTERM", () => {
    console.error("Got SIGTERM (docker container stop). Graceful shutdown")
    shutdown()
})

module.exports = server
