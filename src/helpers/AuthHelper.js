import crypto from "crypto"
import * as CreateError from "http-errors"
import AuthService from "../services/AuthService"
import {
    HASH_SECRET,
    ACCESS_TOKEN_LIFE,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_LIFE,
    REFRESH_TOKEN_SECRET
} from "../config/tokens"
import Mailer from "./MailerHelper"
import { ERROR_CODES } from "../constants/GlobalConstant"

const jwt = require("jsonwebtoken")

class AuthHelper {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_LIFE
        })
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_LIFE
        })

        const refreshSave = {
            user: payload.id,
            accessToken,
            refreshToken
        }

        await AuthService.storageRefreshToken(refreshSave)
        return { accessToken, refreshToken }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRET)
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, REFRESH_TOKEN_SECRET)
    }

    async generateHash(email) {
        const key = email
        const otp = await this.generateOtp()
        const ttl = 1000 * 60 * 10 // 10 min
        const expires = Date.now() + ttl
        const data = `${key}.${otp}.${expires}`
        const hash = this.hashOtp(data)

        return {
            hash: `${hash}.${expires}`,
            otp,
            email
        }
    }

    async generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000)
        return otp
    }

    hashOtp(data) {
        return crypto.createHmac("sha256", HASH_SECRET).update(data).digest("hex")
    }

    async sendMail({ otp, email }) {
        try {
            const to = email
            const subject = `${otp} is your confirmation code on HirePlayer App`
            const payload = { otp, email }
            const result = await Mailer.sendMail({ to, subject, payload })
            return result
        } catch (error) {
            console.error(error.message)
            throw new CreateError.InternalServerError(ERROR_CODES.ERROR_SEND_MAIL)
        }
    }
}

export default new AuthHelper()
