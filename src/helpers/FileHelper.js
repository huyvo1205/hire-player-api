/* eslint-disable no-restricted-syntax */
import path from "path"
import fs from "fs"
import Config from "../config/config"

class FileHelper {
    removeFilesFromDisk({ key, files = [] }) {
        if (!key || !files.length) return
        const CONFIG_BY_KEY = Config.UPLOAD_FILES[key]
        if (!CONFIG_BY_KEY) return
        for (const file of files) {
            const dest = path.join(path.resolve("src/public/storage", CONFIG_BY_KEY.BUCKET, file.filename))
            fs.unlinkSync(dest)
        }
    }
}

export default new FileHelper()
