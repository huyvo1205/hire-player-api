export default {
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || "hire_player",
    MONGO_IP: process.env.MONGO_IP || "localhost",
    MONGO_PORT: process.env.MONGO_PORT || "27017",
    MONGO_USER: process.env.MONGO_USER || "hireplayer",
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || "root",
    MONGO_DB: process.env.DB_URL || "localhost",
    MONGO_OPTIONS: {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        // replicaSet: "rs0",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/hire_player"
}
