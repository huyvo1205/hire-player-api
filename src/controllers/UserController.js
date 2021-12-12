import PaymentService from "../services/PaymentService"
import UserValidator from "../validators/UserValidator"
import { SUCCESS_CODES } from "../constants/PaymentSettingConstant"
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
}

export default new UserController()
