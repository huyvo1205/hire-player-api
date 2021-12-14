import * as CreateError from "http-errors"
import { ERROR_CODES } from "../constants/UserConstant"
import { ERROR_CODES as ERROR_CODES_PAYMENT } from "../constants/PaymentSettingConstant"
import UserModel from "../models/UserModel"
import PaymentSettingModel from "../models/PaymentSettingModel"

class UserValidator {
    async validateCreatePaymentSettings({ methods = [], userId = "" }) {
        const countUser = await UserModel.countDocuments({ _id: userId })
        if (!countUser) throw new CreateError.BadRequest(ERROR_CODES.ERROR_USER_NOT_FOUND)
        const countUserSetting = await PaymentSettingModel.countDocuments({ user: userId })
        if (countUserSetting)
            throw new CreateError.BadRequest(ERROR_CODES_PAYMENT.ERROR_USER_ALREADY_CREATE_PAYMENT_SETTING)
        return {
            methods,
            user: userId
        }
    }

    async validateUpdatePaymentSettings({ paymentSettingId, methods }) {
        const paymentSetting = await PaymentSettingModel.findOne({ _id: paymentSettingId })
        if (!paymentSetting) throw new CreateError.BadRequest(ERROR_CODES_PAYMENT.ERROR_PAYMENT_SETTING_NOT_FOUND)
        return { methods }
    }
}

export default new UserValidator()
