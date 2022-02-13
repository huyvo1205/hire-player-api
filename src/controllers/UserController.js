import bcrypt from "bcryptjs"
import PaymentService from "../services/PaymentService"
import UserService from "../services/UserService"
import UserValidator from "../validators/UserValidator"
import PaymentSettingModel from "../models/PaymentSettingModel"
import { SUCCESS_CODES } from "../constants/PaymentSettingConstant"
import UploadFileMiddleware from "../middlewares/UploadFileMiddleware"
import FileHelper from "../helpers/FileHelper"
import { BCRYPT_SALT } from "../config/tokens"
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

    async getPaymentSetting(req, res) {
        const userId = req.user.id
        const paymentSetting = await PaymentService.getDetailPaymentSetting(userId)
        return res.status(200).send({
            data: paymentSetting,
            message: SUCCESS_CODES.GET_DETAIL_PAYMENT_SETTING_SUCCESS
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
        const { paymentMethodId } = req.body
        const paymentMethodStripe = await UserValidator.validateUpdatePaymentSettingsCreditCard({ paymentMethodId })

        const oldConfig = await PaymentSettingModel.findOne({
            user: userId
        })
        let customerId
        if (oldConfig) {
            /* update */
            customerId = oldConfig.creditCardConfig.customerId
        }

        if (!customerId) {
            const customer = await PaymentService.createCustomerPaymentStripe({
                paymentMethodId,
                name: customerName
            })
            customerId = customer.id
        }
        const {
            brand,
            country,
            exp_month: expMonth,
            exp_year: expYear,
            fingerprint,
            funding,
            last4
        } = paymentMethodStripe.card
        const dataUpdateCreditCardConfig = {
            user: userId,
            creditCardConfig: {
                customerId,
                paymentMethods: [
                    {
                        paymentMethodId,
                        type: "card",
                        card: {
                            brand,
                            country,
                            expMonth,
                            expYear,
                            fingerprint,
                            funding,
                            last4
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
            message: SUCCESS_CODES.CREATE_PAYMENT_SETTING_CREDIT_CARD_SUCCESS
        })
    }

    async getPaymentSettingsCreditCard(req, res) {
        const userId = req.user.id
        const paymentMethodStripe = await UserValidator.validateGetPaymentSettingsCreditCard({
            userId
        })
        const { card = {} } = paymentMethodStripe
        return res.status(200).send({
            data: card,
            message: SUCCESS_CODES.GET_DETAIL_CREDIT_CARD_SUCCESS
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
        const userId = req.user.id
        const dataUpdate = { ...req.body }
        const newUser = await UserService.updateUser(userId, dataUpdate)
        return res.status(200).send({
            data: newUser,
            message: SUCCESS_CODES.UPDATE_USER_INFO_SUCCESS
        })
    }

    async uploadAvatarUserInfo(req, res) {
        const KEY = "AVATAR"
        const userId = req.user.id
        const user = await UserValidator.validateUser(userId)
        const files = await UploadFileMiddleware.uploadFiles(KEY, req, res)
        const avatar = files.length ? files[0] : {}
        const updateData = { avatar }
        const newUser = await UserService.updateUser(userId, updateData)
        /* remove old avatar */
        const oldAvatar = user.avatar || null
        if (oldAvatar && oldAvatar.filename) {
            await FileHelper.removeFilesFromDisk({ files: [oldAvatar], key: KEY })
        }
        res.status(200).send({
            data: newUser,
            message: SUCCESS_CODES.UPLOAD_AVATAR_SUCCESS
        })
    }

    async changePassword(req, res) {
        const { user } = req
        const { oldPassword, newPassword, confirmPassword } = req.body
        await UserValidator.validateChangePassword({ user, oldPassword, newPassword, confirmPassword })
        const password = await bcrypt.hash(newPassword, Number(BCRYPT_SALT))
        const dataUpdate = { password }
        const newUser = await UserService.updateUser(user.id, dataUpdate)
        res.status(200).send({
            data: newUser,
            message: SUCCESS_CODES.CHANGE_PASSWORD_SUCCESS
        })
    }
}

export default new UserController()
