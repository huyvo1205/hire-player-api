import PlayerModel from "../models/PlayerModel"

class PlayerService {
    async createPlayerInfo(data) {
        const newPlayer = await PlayerModel.create(data)
        const player = await PlayerModel.findById(newPlayer.id).populate("user")
        return player
    }

    async updatePlayerInfo(id, updateData) {
        await PlayerModel.updateOne({ _id: id }, updateData)
        const player = await PlayerModel.findById(id).populate("user")
        return player
    }

    async getDetailPlayerInfo(id) {
        return PlayerModel.findOne({ _id: id }).populate("user")
    }

    async getListPlayerInfo(filter, options) {
        const players = await PlayerModel.paginate(filter, options)
        return players
    }
}

export default new PlayerService()
