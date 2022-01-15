/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose"
import NotificationConstant from "../constants/NotificationConstant"

class NotificationHelper {
    getDataCreateNotify({ customer, player, receiver, hire, conversation, image, action, review }) {
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
            payload: {
                hireId: mongoose.Types.ObjectId(hireId),
                conversationId: mongoose.Types.ObjectId(conversationId)
            },
            image,
            action
        }
        if (action === NotificationConstant.ACTIONS.REQUEST_HIRE) {
            createNotifyData.payload.timeRent = timeRent
            createNotifyData.payload.customerNote = customerNote
        }

        if (action === NotificationConstant.ACTIONS.REVIEW && review) {
            const { starPoint } = review
            createNotifyData.payload.starPoint = starPoint
            createNotifyData.payload.reviewId = mongoose.Types.ObjectId(review.id)
        }
        return createNotifyData
    }
}

export default new NotificationHelper()
