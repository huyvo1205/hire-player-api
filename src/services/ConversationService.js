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
}

export default new ConversationService()
