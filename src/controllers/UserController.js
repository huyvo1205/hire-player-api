import * as CreateError from "http-errors"
import PaymentService from "../services/PaymentService"
import UserService from "../services/UserService"
import UserValidator from "../validators/UserValidator"
import PaymentSettingModel from "../models/PaymentSettingModel"
import { SUCCESS_CODES } from "../constants/PaymentSettingConstant"
import RechargeConstant from "../constants/RechargeConstant"
import pick from "../utils/pick"

class UserController {
    async getPaymentSettings(req, res) {
        const { userId, status } = req.query
        const filter = {}
        if (userId) filter.user = userId
        if (status) filter.status = status
        const options = pick(req.query, ["sortBy", "limit", "page"])
        const paymentSettings = await PaymentService.getListPaymentSettings(filter, options)
        return res.status(200).send({
            data: paymentSettings,
            message: SUCCESS_CODES.GET_PAYMENT_SETTING_SUCCESS
        })
    }

    async createPaymentSettings(req, res) {
        const { methods, userId } = req.body
        const data = await UserValidator.validateCreatePaymentSettings({ methods, userId })
        const paymentSetting = await PaymentService.createPaymentSetting(data)
        return res.status(201).send({
            data: paymentSetting,
            message: SUCCESS_CODES.CREATE_PAYMENT_SETTING_SUCCESS
        })
    }

    async updatePaymentSettingsCreditCard(req, res) {
        const userId = req.user.id
        const customerName = req.user.userName
        const { number, expMonth, expYear, cvc } = req.body

        const oldConfig = await PaymentSettingModel.findOne({
            user: userId,
            "creditCardConfig.paymentMethods.card.number": number
        })
        let paymentMethodId
        let customerId
        if (oldConfig) {
            /* update */
            const oldPaymentMethod = oldConfig.creditCardConfig.paymentMethods.find(item => item.card.number === number)
            paymentMethodId = oldPaymentMethod.paymentMethodId
            const dataUpdate = {
                card: { exp_month: expMonth, exp_year: expYear }
            }
            await PaymentService.updatePaymentMethodStripe(paymentMethodId, dataUpdate)
            customerId = oldConfig.creditCardConfig.customerId
        } else {
            const dataCreate = {
                type: "card",
                card: {
                    number,
                    exp_month: expMonth,
                    exp_year: expYear,
                    cvc
                }
            }
            const paymentMethod = await PaymentService.createPaymentMethodStripe(dataCreate)
            paymentMethodId = paymentMethod.id
            const customer = await PaymentService.createCustomerPaymentStripe({
                paymentMethodId,
                name: customerName
            })
            customerId = customer.id
        }

        const dataUpdateCreditCardConfig = {
            user: userId,
            creditCardConfig: {
                customerId,
                paymentMethods: [
                    {
                        paymentMethodId,
                        type: "card",
                        card: {
                            number,
                            expMonth,
                            expYear,
                            cvc
                        }
                    }
                ]
            }
        }
        const newPaymentSetting = await PaymentSettingModel.findOneAndUpdate(
            { user: userId },
            dataUpdateCreditCardConfig,
            { upsert: true, new: true }
        )
        return res.status(200).send({
            data: newPaymentSetting,
            message: SUCCESS_CODES.CREATE_PAYMENT_SETTING_SUCCESS
        })
    }

    async updatePaymentSettings(req, res) {
        const paymentSettingId = req.params.id
        const { methods = [] } = req.body
        const updateData = await UserValidator.validateUpdatePaymentSettings({ paymentSettingId, methods })
        const newPaymentSetting = await PaymentService.updatePaymentSetting(paymentSettingId, updateData)
        return res.status(200).send({
            data: newPaymentSetting,
            message: SUCCESS_CODES.UPDATE_PAYMENT_SETTING_SUCCESS
        })
    }

    async updateUserInfo(req, res) {
        const userId = req.params.id
        await UserValidator.validateUser(userId)
        const dataUpdate = { ...req.body }
        const newUser = await UserService.updateUser(userId, dataUpdate)
        return res.status(200).send({
            data: newUser,
            message: SUCCESS_CODES.UPDATE_USER_INFO_SUCCESS
        })
    }
}

export default new UserController()
