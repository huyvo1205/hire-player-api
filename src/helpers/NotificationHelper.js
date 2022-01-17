/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose"
import NotificationConstant from "../constants/NotificationConstant"

class NotificationHelper {
    getDataCreateNotify({
        customer = {},
        player = {},
        receiver = {},
        hire = {},
        conversation = {},
        donate = {},
        image,
        action,
        review
    }) {
        const { id: receiverId } = receiver
        const { id: hireId, timeRent, customerNote } = hire
        const { id: conversationId } = conversation
        const { avatar, userName, id: customerId } = customer
        const { playerInfo, id: playerId } = player

        const newCustomer = {
            avatar,
            userName,
            id: customerId
        }
        const newPlayer = {
            playerInfo: {
                playerName: playerInfo.playerName,
                rank: playerInfo.rank,
                playerAvatar: playerInfo.playerAvatar
            },
            id: playerId
        }
        const createNotifyData = {
            customer: newCustomer,
            player: newPlayer,
            receiver: receiverId,
            href: `hires/${hireId}`,
            payload: {},
            image,
            action
        }

        if (hireId) {
            createNotifyData.payload.hireId = mongoose.Types.ObjectId(hireId)
        }

        if (conversationId) {
            createNotifyData.payload.conversationId = mongoose.Types.ObjectId(conversationId)
        }

        if (action === NotificationConstant.ACTIONS.REQUEST_HIRE) {
            createNotifyData.payload.timeRent = timeRent
            createNotifyData.payload.customerNote = customerNote
        }

        if (action === NotificationConstant.ACTIONS.REVIEW && review.id) {
            const { starPoint } = review
            createNotifyData.payload.starPoint = starPoint
            createNotifyData.payload.reviewId = mongoose.Types.ObjectId(review.id)
        }

        if (action === NotificationConstant.ACTIONS.DONATE && donate.id) {
            const { amount, message } = donate
            createNotifyData.payload.donateAmount = amount
            createNotifyData.payload.donateMessage = message
            createNotifyData.payload.donateId = mongoose.Types.ObjectId(donate.id)
            createNotifyData.href = `donates/${donate.id}`
        }
        return createNotifyData
    }
}

export default new NotificationHelper()
