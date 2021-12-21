import * as CreateError from "http-errors"
import * as _ from "lodash"
import MessageConstant from "../constants/MessageConstant"
import UserModel from "../models/UserModel"
import ConversationModel from "../models/ConversationModel"
import MessageModel from "../models/MessageModel"

class MessageValidator {
    async validateCreateMessage({ conversationId, senderId }) {
        const countConversation = await ConversationModel.countDocuments({ _id: conversationId })
        if (!countConversation) throw new CreateError.NotFound(MessageConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND)
        const countPlayer = await UserModel.countDocuments({ _id: senderId })
        if (!countPlayer) throw new CreateError.BadRequest(MessageConstant.ERROR_CODES.ERROR_SENDER_NOT_FOUND)
        return null
    }

    async validateUpdateMessage({ messageId }) {
        const message = await MessageModel.findOne({ _id: messageId })
        if (!message) throw new CreateError.NotFound(MessageConstant.ERROR_CODES.ERROR_MESSAGE_NOT_FOUND)
        return message
    }

    async validateGetMessage({ messageId }) {
        const message = await MessageModel.findOne({ _id: messageId })
        if (!message) throw new CreateError.NotFound(MessageConstant.ERROR_CODES.ERROR_MESSAGE_NOT_FOUND)
        return message
    }
}

export default new MessageValidator()
