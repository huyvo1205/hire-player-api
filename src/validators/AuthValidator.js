import * as CreateError from "http-errors"
import * as _ from "lodash"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { ERROR_CODES } from "../constants/UserConstant"
import { ERROR_CODES as ERROR_CODES_AUTH } from "../constants/GlobalConstant"
import { UserModel, TokenModel } from "../models"
import AuthHelper from "../helpers/AuthHelper"
import { BCRYPT_SALT } from "../config/tokens"
import Config from "../config/config"

class AuthValidator {
    async validateCreateUser(body) {
        const { email, password } = body
        if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_INVALID)
        }
        const countEmail = await UserModel.countDocuments({
            email: email.toLowerCase()
        })
        if (countEmail) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_ALREADY_EXISTS)
        }
        return _.cloneDeep(body)
    }

    async validateUserLogin({ email, password }) {
        const user = await UserModel.findOne({ email })
        if (!user) throw new CreateError.BadRequest(ERROR_CODES.ERROR_UNAUTHORIZED)
        const isCorrect = await user.isPasswordMatch(password)
        if (!isCorrect) throw new CreateError.BadRequest(ERROR_CODES.ERROR_UNAUTHORIZED)
        return user
    }

    validateOtp({ otp, hash, email }) {
        const key = email
        const [hashedOtp, expires] = hash.split(".")
        if (Date.now() > +expires) throw new CreateError.BadRequest(ERROR_CODES_AUTH.ERROR_OTP_EXPIRED)
        const data = `${key}.${Number(otp)}.${expires}`
        const isValid = this.verifyOtp({ hashedOtp, data })
        if (!isValid) throw new CreateError.BadRequest(ERROR_CODES_AUTH.ERROR_OTP_INVALID)
        return isValid
    }

    verifyOtp({ hashedOtp, data }) {
        const computedHash = AuthHelper.hashOtp(data)
        return computedHash === hashedOtp
    }

    async validateRequestResetPassword({ email }) {
        const user = await UserModel.findOne({ email })
        if (!user) throw new CreateError.BadRequest(ERROR_CODES.ERROR_EMAIL_DOES_NOT_EXIST)
        const token = await TokenModel.findOne({ user: user.id })
        if (token) await token.deleteOne()
        const resetToken = crypto.randomBytes(32).toString("hex")
        const hash = await bcrypt.hash(resetToken, Number(BCRYPT_SALT))
        await new TokenModel({ user: user.id, hash }).save()
        const link = `${Config.CLIENT.CLIENT_URL}/password-reset?token=${resetToken}&id=${user.id}`
        return link
    }

    async validateResetPassword({ userId, token, password }) {
        const tokenFound = await TokenModel.findOne({ user: userId })
        if (!tokenFound) throw new CreateError.BadRequest(ERROR_CODES.ERROR_INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN)
        if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_INVALID)
        }
        const isValid = await bcrypt.compare(token, tokenFound.hash)
        if (!isValid) throw new CreateError.BadRequest(ERROR_CODES.ERROR_INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN)
        const newPassword = await bcrypt.hash(password, Number(BCRYPT_SALT))
        return newPassword
    }
}

export default new AuthValidator()
