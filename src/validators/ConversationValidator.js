import * as CreateError from "http-errors"
import * as _ from "lodash"
import ConversationConstant from "../constants/ConversationConstant"
import MessageConstant from "../constants/MessageConstant"
import UserModel from "../models/UserModel"
import ConversationModel from "../models/ConversationModel"
import MessageModel from "../models/MessageModel"

class ConversationValidator {
    async validateCreateConversation({ customerId, playerId }) {
        const conversation = await ConversationModel.findOne({
            customer: { $in: [customerId, playerId] },
            player: { $in: [customerId, playerId] }
        })
            .populate(ConversationConstant.POPULATE_CUSTOMER)
            .populate(ConversationConstant.POPULATE_PLAYER)
        if (conversation) return conversation
        const countPlayer = await UserModel.countDocuments({ _id: { $in: [customerId, playerId] } })
        if (countPlayer < 2) throw new CreateError.BadRequest(ConversationConstant.ERROR_CODES.ERROR_MEMBERS_NOT_FOUND)
        return null
    }

    async validateCreateConversationMessage({ conversationId, senderId }) {
        const conversation = await ConversationModel.findById(conversationId)
        if (!conversation) throw new CreateError.NotFound(ConversationConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND)
        const sender = await UserModel.findById(senderId)
        if (!sender) throw new CreateError.NotFound(ConversationConstant.ERROR_CODES.ERROR_SENDER_NOT_FOUND)
        const isMembers = conversation.members.includes(senderId)
        if (!isMembers)
            throw new CreateError.BadRequest(ConversationConstant.ERROR_CODES.ERROR_SENDER_NOT_IN_CONVERSATION)
        return { sender, conversation }
    }

    async validateUpdateConversation({ conversationId, latestMessageId }) {
        const conversation = await ConversationModel.findOne({ _id: conversationId })
        if (!conversation) throw new CreateError.NotFound(ConversationConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND)
        const countMessage = await MessageModel.countDocuments({ _id: latestMessageId })
        if (!countMessage) throw new CreateError.BadRequest(ConversationConstant.ERROR_CODES.ERROR_MESSAGE_NOT_FOUND)
        return conversation
    }

    async validateGetConversation({ conversationId }) {
        const conversation = await ConversationModel.findOne({ _id: conversationId })
        if (!conversation) throw new CreateError.NotFound(ConversationConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND)
        return conversation
    }

    async validateUserInConversation({ conversationId, userIdLogin }) {
        const conversation = await ConversationModel.findOne({ _id: conversationId })
        if (!conversation) throw new CreateError.NotFound(ConversationConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND)
        const isMembers = conversation.members.includes(userIdLogin)
        if (!isMembers)
            throw new CreateError.BadRequest(ConversationConstant.ERROR_CODES.ERROR_USER_NOT_IN_CONVERSATION)
        return conversation
    }

    async validateJoinConversation({ conversationId, playerId }) {
        const defaultError = {
            error: null,
            conversation: null
        }
        const conversation = await ConversationModel.findById(conversationId).populate({
            path: "members"
        })

        if (!conversation) {
            const errorChat = {
                code: 404,
                errors: [ConversationConstant.ERROR_CODES.ERROR_CONVERSATION_NOT_FOUND]
            }
            defaultError.error = errorChat
            return defaultError
        }

        /* validate playerId */
        const { members } = conversation
        const userFound = members.find(member => member.id === playerId)
        if (!userFound) {
            const errorChat = {
                code: 400,
                errors: [ConversationConstant.ERROR_CODES.ERROR_USER_NOT_IN_CONVERSATION]
            }
            defaultError.error = errorChat
            return defaultError
        }
        defaultError.conversation = conversation
        return defaultError
    }
}

export default new ConversationValidator()
