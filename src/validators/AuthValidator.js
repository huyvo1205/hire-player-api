import * as CreateError from "http-errors"
import * as _ from "lodash"
import { ERROR_CODES } from "../constants/UserConstant"
import { ERROR_CODES as ERROR_CODES_AUTH } from "../constants/GlobalConstant"
import { UserModel } from "../models"
import AuthHelper from "../helpers/AuthHelper"

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
}

export default new AuthValidator()
