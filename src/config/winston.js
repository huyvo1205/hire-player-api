import * as _FS from "fs"
import * as winston from "winston"
import AppConf from "./application"

require("winston-daily-rotate-file")

// check exist folder
if (!_FS.existsSync(AppConf.folder.logDir)) {
    _FS.mkdirSync(AppConf.folder.logDir)
}

// setting file log
const transport = new winston.transports.DailyRotateFile({
    filename: `${AppConf.folder.logDir}`.concat(AppConf.file.applog.filename),
    datePattern: AppConf.file.applog.datePattern,
    zippedArchive: AppConf.file.applog.zippedArchive,
    handleExceptions: AppConf.file.applog.handleExceptions,
    maxSize: AppConf.file.applog.maxSize,
    maxFiles: AppConf.file.applog.maxFiles
})

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        transport
    ],
    exitOnError: false
})

module.exports = logger
