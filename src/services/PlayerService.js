import UserModel from "../models/UserModel"

class PlayerService {
    async createPlayerInfo(data) {
        const newUser = await UserModel.create(data)
        return newUser
    }

    async updatePlayerInfo(id, updateData) {
        const newUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true })
        return newUser
    }

    async getDetailPlayerInfo(id) {
        return UserModel.findOne({ _id: id })
    }

    async getListPlayerInfo(filter, options) {
        const users = await UserModel.paginate(filter, options)
        return users
    }
}

export default new PlayerService()
