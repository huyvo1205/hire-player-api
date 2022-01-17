/* eslint-disable no-underscore-dangle */
import ConversationModel from "../models/ConversationModel"
import ConversationConstant from "../constants/ConversationConstant"

class ConversationService {
    async createConversation(data, isPopulate = true) {
        const newConversation = await ConversationModel.create(data)
        if (isPopulate) {
            return ConversationModel.findById(newConversation.id)
                .populate(ConversationConstant.POPULATE_CUSTOMER)
                .populate(ConversationConstant.POPULATE_PLAYER)
        }
        return newConversation
    }

    async updateConversation(id, updateData) {
        await ConversationModel.updateOne({ _id: id }, { $set: updateData })
        const conversation = await ConversationModel.findById(id)
            .populate(ConversationConstant.POPULATE_CUSTOMER)
            .populate(ConversationConstant.POPULATE_PLAYER)
        return conversation
    }

    async getDetailConversation(id) {
        return ConversationModel.findOne({ _id: id })
            .populate(ConversationConstant.POPULATE_CUSTOMER)
            .populate(ConversationConstant.POPULATE_PLAYER)
    }

    async deleteConversation(id) {
        return ConversationModel.deleteOne({ _id: id })
    }

    async getListConversations(filter, options) {
        const conversations = await ConversationModel.paginate(filter, options)
        return conversations
    }

    async updateLatestMessageConversation({ conversation, message, userIdLogin, sender, hireId }) {
        const conversationId = conversation.id
        /* update latestMessage for conversation */
        const messageObject = message.toObject()
        messageObject.id = messageObject._id
        messageObject.unreadStatus = conversation.members.reduce(
            (preValue, currentValue) => ({ ...preValue, [currentValue]: 1 }),
            {}
        )
        delete messageObject.unreadStatus[`${userIdLogin}`]
        delete messageObject._id

        const updateData = { latestMessage: messageObject }
        if (hireId) updateData.latestHire = hireId
        const newConversation = await this.updateConversation(conversationId, updateData)
        const dataRes = {
            conversation: newConversation,
            body: messageObject.body,
            sender,
            latestMessage: messageObject
        }
        return dataRes
    }

    async checkExistConversation({ customerId, playerId }) {
        const conversation = await ConversationModel.findOne({
            customer: { $in: [customerId, playerId] },
            player: { $in: [customerId, playerId] }
        })
            .populate(ConversationConstant.POPULATE_CUSTOMER)
            .populate(ConversationConstant.POPULATE_PLAYER)
        return conversation
    }
}

export default new ConversationService()
