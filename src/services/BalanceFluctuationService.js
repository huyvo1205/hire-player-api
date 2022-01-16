import BalanceFluctuationModel from "../models/BalanceFluctuationModel"
import UserModel from "../models/UserModel"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"

class BalanceFluctuationService {
    async createBalanceFluctuation({ user, operation, amount, action, session }) {
        const opts = { session }
        const dataCreate = {
            user,
            amount,
            operation,
            action
        }
        const newBalance = await BalanceFluctuationModel.create([dataCreate], opts)
        const amountOperation = operation + amount
        const dataUpdateUser = { $inc: { money: Number(amountOperation) } }
        await UserModel.updateOne({ _id: user }, dataUpdateUser, opts)
        return newBalance
    }

    async createBalanceFluctuationNotSession({ user, operation, amount, action }) {
        const dataCreate = {
            user,
            amount,
            operation,
            action
        }
        const newBalance = await BalanceFluctuationModel.create(dataCreate)
        const amountOperation = operation + amount
        const dataUpdateUser = { $inc: { money: Number(amountOperation) } }
        await UserModel.updateOne({ _id: user }, dataUpdateUser)
        return newBalance
    }

    async updatePlayerInfo(id, dataUpdateUser) {
        const newUser = await UserModel.updateOne({ _id: id }, dataUpdateUser)
        return newUser
    }

    async getDetailPlayerInfo(id) {
        return BalanceFluctuationModel.findOne({ _id: id })
    }

    async getListPlayerInfo(filter, options) {
        const users = await BalanceFluctuationModel.paginate(filter, options)
        return users
    }
}

export default new BalanceFluctuationService()
