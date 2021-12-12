import PaymentSettingModel from "../models/PaymentSettingModel"

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
}

export default new PaymentService()
