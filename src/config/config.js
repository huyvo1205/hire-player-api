export default {
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET || "access-token-secret",
        accessExpiration: 30
    },
    EMAIL: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || "your_email@gmail.com",
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "your_password",
        MAIL_HOST: process.env.MAIL_HOST || "smtp.gmail.com",
        MAIL_PORT: process.env.MAIL_PORT || 587
    },
    CLIENT: {
        CLIENT_URL: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "localhost://3000"
    },
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    PAYPAL: {
        CLIENT_ID:
            process.env.PAYPAL_CLIENT_ID ||
            "AZvB_LTg9fAUJurPkA_Ru_oUapmSSum2vD0fIBDy37S_15JLwRDV4Ez5uI2vovD6gv0o1DdIsl4x4h7k",
        CLIENT_SECRET:
            process.env.PAYPAL_CLIENT_SECRET ||
            "EIWg8QmJPoaww2UEZSJ57fOpskUYOYCa6f-wGmQxsv7ZyUb4IZY8eY7ajISGZfdZwqDLW5MNnoKUZYIT",
        PAYPAL_SUCCESS_URL: process.env.PAYPAL_SUCCESS_URL || "/api/transactions/recharge/success",
        PAYPAL_CANCEL_URL: process.env.PAYPAL_CANCEL_URL || "/api/transactions/recharge/cancel"
    },
    UPLOAD_FILES: {
        /* Upload images */
        IMAGES: {
            FIELDS: [
                {
                    name: "images",
                    maxCount: 15
                }
            ],
            BUCKET: "images",
            ALLOWED_CONTENT_TYPES: ["image/png", "image/jpeg"],
            MAX_FILE_SIZE: 5388608
        },
        /* Upload images for chat */
        CHAT: {
            FIELDS: [
                {
                    name: "images",
                    maxCount: 10
                }
            ],
            BUCKET: "chat",
            ALLOWED_CONTENT_TYPES: ["image/png", "image/jpeg"],
            MAX_FILE_SIZE: 5388608
        },
        AVATAR: {
            FIELDS: [
                {
                    name: "avatar",
                    maxCount: 1
                }
            ],
            BUCKET: "avatar",
            ALLOWED_CONTENT_TYPES: ["image/png", "image/jpeg"],
            MAX_FILE_SIZE: 5388608
        }
    }
}
