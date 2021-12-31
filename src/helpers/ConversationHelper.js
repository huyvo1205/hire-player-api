/* eslint-disable no-underscore-dangle */
import UserModel from "../models/UserModel"

class ConversationHelper {
    async getConversationFilter({ playerId, customerId, status, searchText, ignoreIds = [], userIdLogin }) {
        const filter = {}
        let memberIds = []

        if (playerId) memberIds.push(playerId)
        if (customerId) memberIds.push(customerId)
        if (userIdLogin) {
            filter.$or = [{ customer: userIdLogin }, { player: userIdLogin }]
        }
        if (status) filter.status = status
        if (ignoreIds.length) {
            const ignoreIdsSplit = ignoreIds.split(",")
            filter._id = { $nin: ignoreIdsSplit }
        }

        if (searchText) {
            const filterPlayer = { "playerInfo.playerName": { $regex: searchText.trim(), $options: "i" } }
            const players = await UserModel.find(filterPlayer).select("_id")
            const playerIds = players.map(player => player._id)
            if (playerIds.length) {
                memberIds = [...memberIds, ...playerIds]
            }
        }
        if (memberIds.length) filter.members = { $in: memberIds }
        return filter
    }
}

export default new ConversationHelper()
