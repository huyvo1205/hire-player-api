import * as CreateError from "http-errors"
import { ERROR_CODES } from "../constants/UserConstant"
import UserModel from "../models/UserModel"

class TransactionValidator {
    async validateRechargePaypal({ userId }) {
        const countUser = await UserModel.countDocuments({ _id: userId })
        if (!countUser) throw new CreateError.BadRequest(ERROR_CODES.ERROR_USER_NOT_FOUND)
    }
}

export default new TransactionValidator()
