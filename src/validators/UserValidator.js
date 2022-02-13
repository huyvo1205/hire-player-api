import * as CreateError from "http-errors"
import { ERROR_CODES } from "../constants/UserConstant"
import { ERROR_CODES as ERROR_CODES_PAYMENT } from "../constants/PaymentSettingConstant"
import UserModel from "../models/UserModel"
import PaymentSettingModel from "../models/PaymentSettingModel"
import PaymentService from "../services/PaymentService"
import RechargeConstant from "../constants/RechargeConstant"

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

    async validateUser(id) {
        const user = await UserModel.findById({ _id: id })
        if (!user) throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND)
        return user
    }

    async validateChangePassword({ user, oldPassword, newPassword, confirmPassword }) {
        const isCorrect = await user.isPasswordMatch(oldPassword)
        if (!isCorrect) throw new CreateError.BadRequest(ERROR_CODES.ERROR_OLD_PASSWORD_INVALID)

        if (newPassword !== confirmPassword) {
            throw new CreateError.BadRequest(ERROR_CODES.ERROR_PASSWORD_NOT_MATCH)
        }

        const isValidPassword = this.validatePassword(newPassword)
        if (!isValidPassword) throw new CreateError.BadRequest(ERROR_CODES.ERROR_NEW_PASSWORD_INVALID)
    }

    /* 
     - 8 to 15 characters which contain at least one lowercase letter
     - one uppercase letter,
     - one numeric digit
     - one special character
    */
    validatePassword(password) {
        const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
        const isValidPassword = password.match(decimal)
        return isValidPassword
    }

    async validateGetPaymentSettingsCreditCard({ userId }) {
        const oldConfig = await PaymentSettingModel.findOne({
            user: userId
        })

        if (!oldConfig) return {}

        const creditCardConfig = oldConfig.creditCardConfig.paymentMethods.find(item => item.type === "card")
        const { paymentMethodId } = creditCardConfig
        if (!paymentMethodId) return {}
        const paymentMethodStripe = await PaymentService.retrievePaymentMethodStripe(paymentMethodId)

        if (!paymentMethodStripe) {
            throw new CreateError.NotFound(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_METHOD_ID_NOT_FOUND)
        }

        return paymentMethodStripe
    }

    async validateUpdatePaymentSettingsCreditCard({ paymentMethodId }) {
        const paymentMethodStripe = await PaymentService.retrievePaymentMethodStripe(paymentMethodId)

        if (!paymentMethodStripe) {
            throw new CreateError.NotFound(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_METHOD_ID_NOT_FOUND)
        }
        return paymentMethodStripe
    }
}

export default new UserValidator()
