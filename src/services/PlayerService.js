import PlayerModel from "../models/PlayerModel"

class PlayerService {
    async createPlayerInfo(data) {
        return PlayerModel.create(data)
    }

    async updatePlayerInfo(id, updateData) {
        return PlayerModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async getListPlayerInfo(filter, options) {
        const paymentSettings = await PlayerModel.paginate(filter, options)
        return paymentSettings
    }
}

export default new PlayerService()
