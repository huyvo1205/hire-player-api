export default {
    mongoose: {
        url: process.env.MONGODB_URL + (process.env.NODE_ENV === "test" ? "-test" : ""),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}
