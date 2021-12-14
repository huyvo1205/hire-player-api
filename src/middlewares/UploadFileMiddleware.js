import fs from "fs"
import multer from "multer"
import path from "path"
import util from "util"
import CreateError from "http-errors"
import url from "url"
import { ERROR_CODES } from "../constants/GlobalConstant"
import Config from "../config/config"

const formatFiles = ({ req, config, files }) => {
    const host = url.format({ protocol: req.protocol, host: req.get("host") })
    if (!files) {
        return []
    }

    const newFiles = []
    config.FIELDS.forEach(item => {
        files[item.name].forEach(file => {
            file.link = `${host}/storage/${config.BUCKET}/${file.filename}`
            delete file.path
            delete file.destination
            newFiles.push(file)
        })
    })

    return newFiles
}

const uploadFiles = async (key = "IMAGES", req, res) => {
    const CONFIG_BY_KEY = Config.UPLOAD_FILES[key]
    if (!CONFIG_BY_KEY) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_KEY_UPLOAD_INVALID)
    }
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const dest = path.join(path.resolve("src/public/storage", CONFIG_BY_KEY.BUCKET))
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true })
            }
            callback(null, dest)
        },
        filename: (req, file, callback) => {
            const { ALLOWED_CONTENT_TYPES } = CONFIG_BY_KEY
            if (!ALLOWED_CONTENT_TYPES.includes(file.mimetype)) {
                const err = new CreateError.BadRequest(ERROR_CODES.ERROR_MIMETYPE_INVALID)
                return callback(err)
            }
            const filename = `${Date.now()}-hire-player-${file.originalname}`
            return callback(null, filename)
        }
    })
    const uploadMulter = multer({
        storage,
        limits: { fileSize: CONFIG_BY_KEY.MAX_FILE_SIZE }
    })
    const uploadFilesMiddleware = util.promisify(uploadMulter.fields(CONFIG_BY_KEY.FIELDS))
    await uploadFilesMiddleware(req, res)
    /* ~ handle files ~ */
    const files = formatFiles({ req, config: CONFIG_BY_KEY, files: req.files })
    return files
}

export default { uploadFiles }
