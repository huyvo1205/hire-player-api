import * as CreateError from "http-errors"
import crypto from "crypto"
import RechargeConstant from "../constants/RechargeConstant"
import PaymentSettingModel from "../models/PaymentSettingModel"
import RechargeModel from "../models/RechargeModel"
import PaymentService from "../services/PaymentService"
import Config from "../config/config"

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

    async validateRechargeRazorpay({ razorpayOrderId = "", razorpayPaymentId = "", razorpaySignature }) {
        const payment = await PaymentService.getDetailPaymentRazorpay(razorpayPaymentId)

        if (!payment) {
            throw new CreateError.NotFound(RechargeConstant.ERROR_CODES.ERROR_RAZORPAY_PAYMENT_ID_NOT_FOUND)
        }

        const recharge = await RechargeModel.findOne({ key: payment.id })

        if (recharge) {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_RAZORPAY_PAYMENT_ID_INVALID)
        }

        if (payment.status !== "captured") {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_RAZORPAY_PAYMENT_FAIL)
        }

        const generatedSignature = `${razorpayOrderId}|${razorpayPaymentId}`
        const keySecret = Config.RAZORPAY.RAZORPAY_KEY_SECRET
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(generatedSignature.toString())
            .digest("hex")

        if (razorpaySignature !== expectedSignature) {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_RAZORPAY_SIGNATURE_INVALID)
        }
        return payment
    }

    async validateRechargeGooglePay({ paymentIntent }) {
        const { id: paymentIntentId, status } = paymentIntent

        if (status !== "succeeded") {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_GOOGLE_PAY_FAIL)
        }

        const recharge = await RechargeModel.findOne({ key: paymentIntentId })

        if (recharge) {
            throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_INTENT_ID_INVALID)
        }
    }
}

export default new RechargeValidator()
