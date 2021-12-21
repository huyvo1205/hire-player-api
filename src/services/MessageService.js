import MessageModel from "../models/MessageModel"
import MessageConstant from "../constants/MessageConstant"

const populate = MessageConstant.POPULATE_OPTIONS

class MessageService {
    async createMessage(data, isPopulate = true) {
        const newMessage = await MessageModel.create(data)
        if (isPopulate) {
            return MessageModel.findById(newMessage.id).populate(populate)
        }
        return newMessage
    }

    async updateMessage(id, updateData) {
        await MessageModel.updateOne({ _id: id }, updateData)
        const message = await MessageModel.findById(id).populate(populate)
        return message
    }

    async getDetailMessage(id) {
        return MessageModel.findOne({ _id: id }).populate(populate)
    }

    async deleteMessage(id) {
        return MessageModel.deleteOne({ _id: id })
    }

    async getListMessages(filter, options) {
        const messages = await MessageModel.paginate(filter, options)
        return messages
    }
}

export default new MessageService()
