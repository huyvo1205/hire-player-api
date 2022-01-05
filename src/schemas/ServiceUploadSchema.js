import Config from "../config/config"

const upload = {
    type: "object",
    required: ["key"],
    properties: {
        key: { type: "string", enum: Object.values(Config.UPLOAD_FILES) }
    }
}

export default { upload }
