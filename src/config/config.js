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
    }
}
