import * as CreateError from "http-errors"
import Stripe from "stripe"
import Razorpay from "razorpay"
import shortid from "shortid"
import PaymentSettingModel from "../models/PaymentSettingModel"
import RechargeConstant from "../constants/RechargeConstant"
import Config from "../config/config"

const stripe = new Stripe(Config.STRIPE.STRIPE_SECRET_KEY)
const razorpay = new Razorpay({
    key_id: Config.RAZORPAY.RAZORPAY_KEY_ID,
    key_secret: Config.RAZORPAY.RAZORPAY_KEY_SECRET
})
class PaymentService {
    async createPaymentSetting(data) {
        return PaymentSettingModel.create(data)
    }

    async getDetailPaymentSetting(userId) {
        return PaymentSettingModel.findOne({
            user: userId
        })
    }

    async updatePaymentSetting(id, updateData) {
        return PaymentSettingModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async getListPaymentSettings(filter, options) {
        const paymentSettings = await PaymentSettingModel.paginate(filter, options)
        return paymentSettings
    }

    async createOrderRazorpay({ amount }) {
        try {
            const dataCreate = {
                amount,
                currency: "USD",
                receipt: shortid.generate(),
                payment_capture: 1
            }
            const order = await razorpay.orders.create(dataCreate)
            return order
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_RAZORPAY_FAIL)
        }
    }

    async getDetailPaymentRazorpay(paymentId) {
        try {
            const payment = await razorpay.payments.fetch(paymentId)
            return payment
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_GET_DETAIL_PAYMENT_RAZORPAY_FAIL
            )
        }
    }

    async createPaymentStripe({ paymentMethodId, amount, customer }) {
        try {
            const payment = await stripe.paymentIntents.create({
                amount,
                currency: "usd",
                description: "Recharge to HirePlayerApp",
                payment_method: paymentMethodId,
                customer,
                confirm: true
            })
            return payment
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_STRIPE_FAIL)
        }
    }

    async createPaymentIntentsStripe(params) {
        try {
            const paymentIntent = await stripe.paymentIntents.create(params)
            return paymentIntent
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_INTENTS_STRIPE_FAIL
            )
        }
    }

    async retrievePaymentIntentsStripe(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
            return paymentIntent
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_RETRIEVE_PAYMENT_INTENTS_STRIPE_FAIL
            )
        }
    }

    async createCustomerPaymentStripe({ paymentMethodId, name }) {
        try {
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                name
            })
            return customer
        } catch (error) {
            console.error("error: ", error)
            const { statusCode } = error.raw
            if (statusCode === 400) {
                throw new CreateError.BadRequest(
                    RechargeConstant.ERROR_CODES.ERROR_THE_PAYMENT_METHOD_YOU_PROVIDED_HAS_ALREADY_BEEN_ATTACHED_TO_A_CUSTOMER
                )
            }
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL
            )
        }
    }

    async retrievePaymentMethodStripe(paymentMethodId) {
        try {
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
            return paymentMethod
        } catch (error) {
            console.error("error: ", error)
            const { statusCode } = error.raw
            if (statusCode === 404) {
                throw new CreateError.NotFound(RechargeConstant.ERROR_CODES.ERROR_PAYMENT_METHOD_ID_NOT_FOUND)
            }
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_RETRIEVE_PAYMENT_METHOD_STRIPE_FAIL
            )
        }
    }

    async updatePaymentMethodStripe(paymentMethodId, dataUpdate) {
        try {
            const newPaymentMethod = await stripe.paymentMethods.update(paymentMethodId, dataUpdate)
            return newPaymentMethod
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_UPDATE_PAYMENT_METHOD_STRIPE_FAIL
            )
        }
    }

    async createPaymentMethodStripe(body) {
        try {
            const paymentMethod = await stripe.paymentMethods.create(body)
            return paymentMethod
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(
                RechargeConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_METHOD_STRIPE_FAIL
            )
        }
    }
}

export default new PaymentService()
