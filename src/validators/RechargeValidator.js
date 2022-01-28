import * as CreateError from "http-errors"
import RechargeConstant from "../constants/RechargeConstant"
import PaymentSettingModel from "../models/PaymentSettingModel"
import PaymentService from "../services/PaymentService"

class RechargeValidator {
    async validateRechargeStripe({ paymentMethodId, userIdLogin }) {
        const paymentSetting = await PaymentSettingModel.findOne({
            user: userIdLogin,
            "creditCardConfig.paymentMethods.paymentMethodId": paymentMethodId
        })

        if (!paymentSetting) {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_CREDIT_CARD_CONFIG_NOT_CREATE)
        }

        const paymentMethod = await PaymentService.retrievePaymentMethodStripe(paymentMethodId)
        if (!paymentMethod) {
            throw new CreateError.NotFound(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_METHOD_ID_NOT_FOUND)
        }

        return paymentMethod
    }
}

export default new RechargeValidator()
