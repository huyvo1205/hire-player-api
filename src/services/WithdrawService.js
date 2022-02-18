import WithdrawModel from "../models/WithdrawModel"

class WithdrawService {
    async createWithdraw(data) {
        return WithdrawModel.create(data)
    }

    async updateWithdraw(id, updateData) {
        return WithdrawModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async getListWithdraws(filter, options) {
        const withdraws = await WithdrawModel.paginate(filter, options)
        return withdraws
    }
}

export default new WithdrawService()
