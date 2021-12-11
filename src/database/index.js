import mongoose from "mongoose"

import ConfigDB from "../config/db"

let URL = ConfigDB.MONGODB_URL

if (process.env.NODE_ENV === "production") {
    URL = `mongodb://${ConfigDB.MONGO_USER}:${ConfigDB.MONGO_PASSWORD}@${ConfigDB.MONGO_IP}:${ConfigDB.MONGO_PORT}/${ConfigDB.MONGO_DB_NAME}`
}
console.log("URL DATABASE: ", URL)
mongoose.connect(URL, ConfigDB.MONGO_OPTIONS, err => {
    if (err) {
        console.log("Connect to database fail!")
    } else {
        console.log("Connect database Success!")
    }
})
/* If connect throw error */
mongoose.connection.on("error", err => {
    console.info(`Mongoose default connection error: ${err}`)
})
