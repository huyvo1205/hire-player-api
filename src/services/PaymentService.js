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
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_RAZORPAY_FAIL)
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
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_STRIPE_FAIL)
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
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL)
        }
    }

    async retrievePaymentMethodStripe(paymentMethodId) {
        try {
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
            return paymentMethod
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL)
        }
    }

    async updatePaymentMethodStripe(paymentMethodId, dataUpdate) {
        try {
            const newPaymentMethod = await stripe.paymentMethods.update(paymentMethodId, dataUpdate)
            return newPaymentMethod
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL)
        }
    }

    async createPaymentMethodStripe(body) {
        try {
            const paymentMethod = await stripe.paymentMethods.create(body)
            return paymentMethod
        } catch (error) {
            console.error("error: ", error)
            throw new CreateError.InternalServerError(RechargeConstant.ERROR_CODES.CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL)
        }
    }
}

export default new PaymentService()
