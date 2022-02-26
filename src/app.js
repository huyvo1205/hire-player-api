import "./config/bootstrap"
import http from "http"
import express from "express"
import session from "express-session"
import path from "path"
import morgan from "morgan"
import cors from "cors"
import passport from "passport"
import mongoose from "mongoose"
import winston from "./config/winston"
import { ERROR_CODES, SUCCESS_CODES } from "./constants/UserConstant"
import AppConf from "./config/application"
import Messages from "./config/messages"
import AuthService from "./services/AuthService"
import { jwtStrategy } from "./config/passport"
import routes from "./routes"
import Swagger from "./swagger/swaggerConfig"
import HandlerErrorMiddleware from "./middlewares/HandlerErrorMiddleware"
import Database from "./database"
import SocketServer from "./socket/SocketServer"
import RechargeController from "./controllers/RechargeController"
import AuthHelper from "./helpers/AuthHelper"

import Config from "./config/config"

const { GOOGLE_SUCCESS_REDIRECT, GOOGLE_FAILURE_REDIRECT } = Config.GOOGLE_LOGIN
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
    app.use(morgan("combined"))
} else {
    app.use(morgan("dev"))
}

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.use(express.json())
app.use(express.static(path.resolve("src/public")))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: Config.SESSION_SECRET,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.disable("x-powered-by")

app.use(
    cors({
        allowedOrigin: AppConf.cors.allowedOrigin,
        allowedMethods: AppConf.cors.allowedMethods,
        allowedHeaders: AppConf.cors.allowedHeaders,
        exposedHeaders: AppConf.cors.exposedHeaders
        // credentials: AppConf.cors.credentials
    })
)
Swagger.setupSwagger(app)

passport.use("jwt", jwtStrategy)
AuthService.loginWithFacebook(passport)
AuthService.loginWithGoogle(passport)

app.get("/healthcheck", (req, res) => {
    res.send("healthcheck!!! BE server is up!")
})

app.get("/recharges/paypal-success", RechargeController.rechargeSuccess)
app.get("/recharges/paypal-cancel", RechargeController.rechargeCancel)
/* facebook callback */
app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/auth/facebook/failed",
        session: true
    })
)

/* google callback */
app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: GOOGLE_SUCCESS_REDIRECT,
        failureRedirect: GOOGLE_FAILURE_REDIRECT,
        session: true
    })
)

app.get("/auth/facebook/failed", (req, res) => {
    res.send({ message: "/auth/facebook/failed" })
})

app.get("/auth/google/failed", (req, res) => {
    res.status(400).send({ data: {}, message: ERROR_CODES.ERROR_LOGIN_GOOGLE_FAIL })
})

app.get("/auth/google/success", async (req, res) => {
    const isAuthenticated = req.isAuthenticated()
    if (!isAuthenticated) {
        return res.status(401).send({ data: {}, message: ERROR_CODES.ERROR_LOGIN_GOOGLE_UNAUTHORIZED })
    }
    const userInfo = req.user
    const payload = { id: userInfo.id }
    const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
    return res.status(200).send({
        data: userInfo,
        accessToken,
        refreshToken,
        message: SUCCESS_CODES.LOGIN_WITH_GOOGLE_SUCCESS
    })
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

// setupWebSocket(server)
SocketServer.initSocket(server)
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
