import RechargeModel from "../models/RechargeModel"

class RechargeService {
    async createRecharge(data) {
        return RechargeModel.create(data)
    }

    async updateRecharge(id, updateData) {
        return RechargeModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async getListRecharges(filter, options) {
        const Recharges = await RechargeModel.paginate(filter, options)
        return Recharges
    }
}

export default new RechargeService()
