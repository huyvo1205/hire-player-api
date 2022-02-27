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
        CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "PAYPAL_CLIENT_ID",
        CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "PAYPAL_CLIENT_SECRET",
        PAYPAL_SUCCESS_URL: process.env.PAYPAL_SUCCESS_URL || "/api/recharges/paypal-success",
        PAYPAL_CANCEL_URL: process.env.PAYPAL_CANCEL_URL || "/api/recharges/paypal-cancel"
    },
    STRIPE: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "YOUR_STRIPE_SECRET_KEY"
    },
    RAZORPAY: {
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "RAZORPAY_KEY_ID",
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "RAZORPAY_KEY_SECRET"
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
    },
    FACEBOOK_LOGIN: {
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "FACEBOOK_CLIENT_ID",
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || "FACEBOOK_CLIENT_SECRET",
        FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || "FACEBOOK_CALLBACK_URL",
        FACEBOOK_SUCCESS_REDIRECT: process.env.FACEBOOK_SUCCESS_REDIRECT || "FACEBOOK_SUCCESS_REDIRECT",
        FACEBOOK_FAILURE_REDIRECT: process.env.FACEBOOK_FAILURE_REDIRECT || "FACEBOOK_FAILURE_REDIRECT"
    },
    GOOGLE_LOGIN: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET",
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "GOOGLE_CALLBACK_URL",
        GOOGLE_SUCCESS_REDIRECT: process.env.GOOGLE_SUCCESS_REDIRECT || "GOOGLE_SUCCESS_REDIRECT",
        GOOGLE_FAILURE_REDIRECT: process.env.GOOGLE_FAILURE_REDIRECT || "GOOGLE_FAILURE_REDIRECT"
    },
    SESSION_SECRET: process.env.SESSION_SECRET || "SESSION_SECRET"
}
