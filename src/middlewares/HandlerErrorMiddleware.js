import winston from "../config/winston"
import Messages from "../config/messages"

const errorMiddleware = (error, req, res, next) => {
    console.error("error: ", error)
    res.locals.message = error.message
    res.locals.error = req.app.get("env") === "development" ? error : {}

    const status = error.status || error.statusCode || 500
    const message = error.message || Messages.en.unexpected_error

    const line = `${status} - ${req.method} - ${message} - ${req.originalUrl} - ${req.ip} - ${
        req.user && req.user.email
    }`
    winston.error(line)
    const isString = typeof error.message === "string"
    return res.status(error.status || 500).send({
        code: error.status || 500,
        errors: isString ? [error.message] : error.message
    })
}

export default { errorMiddleware }
