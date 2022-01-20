/* eslint-disable no-restricted-syntax */
import path from "path"
import fs from "fs"
import * as CreateError from "http-errors"
import Config from "../config/config"
import { QUALITY, ERROR_CODES } from "../constants/GlobalConstant"

class FileHelper {
    async removeFilesFromDisk({ key, files = [] }) {
        if (!key || !files.length) return
        const CONFIG_BY_KEY = Config.UPLOAD_FILES[key]
        if (!CONFIG_BY_KEY) return
        for (const file of files) {
            const dest = path.join(
                path.resolve("src/public/storage", CONFIG_BY_KEY.BUCKET, `${QUALITY}_${file.filename}`)
            )
            const isExist = await fs.existsSync(dest)
            if (!isExist) {
                throw new CreateError.NotFound(ERROR_CODES.ERROR_FILE_NOT_FOUND)
            } else {
                await fs.unlinkSync(dest)
            }
        }
    }
}

export default new FileHelper()
