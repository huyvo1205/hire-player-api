import ConfigDB from "../config/db"

let URL = ConfigDB.MONGODB_URL
const { MONGO_OPTIONS } = ConfigDB

if (process.env.NODE_ENV === "production") {
    URL = `mongodb://${ConfigDB.MONGO_USER}:${ConfigDB.MONGO_PASSWORD}@${ConfigDB.MONGO_IP}:${ConfigDB.MONGO_PORT}/${ConfigDB.MONGO_DB_NAME}?authSource=admin`
}

export default { URL, MONGO_OPTIONS }
