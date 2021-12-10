import * as CreateError from "http-errors"
import * as _ from "lodash"
import { ERROR_CODES } from "../constants/UserConstant"
import { UserModel } from "../models"

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
}

export default new AuthValidator()
