/* eslint-disable no-underscore-dangle */
import ConversationConstant from "../constants/ConversationConstant"
import ConversationValidator from "../validators/ConversationValidator"
import ConversationService from "../services/ConversationService"
import MessageService from "../services/MessageService"
import pick from "../utils/pick"
import ConversationHelper from "../helpers/ConversationHelper"

class ConversationController {
    async getConversations(req, res) {
        const { playerId, customerId, status, searchText } = req.query
        const filter = await ConversationHelper.getConversationFilter({ playerId, customerId, status, searchText })
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const conversations = await ConversationService.getListConversations(filter, options)
        return res.status(200).send({
            data: conversations,
            message: ConversationConstant.SUCCESS_CODES.GET_CONVERSATIONS_SUCCESS
        })
    }

    async createConversation(req, res) {
        const { customerId, playerId, type } = req.body
        const conversation = await ConversationValidator.validateCreateConversation({ customerId, playerId })
        if (conversation) {
            return res.status(201).send({
                data: conversation,
                message: ConversationConstant.SUCCESS_CODES.CREATE_CONVERSATION_SUCCESS
            })
        }
        const createData = {
            members: [customerId, playerId],
            customer: customerId,
            player: playerId,
            type
        }
        const createConversation = await ConversationService.createConversation(createData)
        return res.status(201).send({
            data: createConversation,
            message: ConversationConstant.SUCCESS_CODES.CREATE_CONVERSATION_SUCCESS
        })
    }

    async updateConversation(req, res) {
        const conversationId = req.params.id
        const { latestMessageId, latestHireId } = req.body
        await ConversationValidator.validateUpdateConversation({ conversationId, latestMessageId, latestHireId })
        const updateData = { ...req.body }
        const updateConversation = await ConversationService.updateConversation(conversationId, updateData)
        res.status(200).send({
            data: updateConversation,
            message: ConversationConstant.SUCCESS_CODES.UPDATE_CONVERSATION_SUCCESS
        })
    }

    async getDetailConversation(req, res) {
        const conversationId = req.params.id
        await ConversationValidator.validateGetConversation({ conversationId })
        const conversation = await ConversationService.getDetailConversation(conversationId)
        res.status(200).send({
            data: conversation,
            message: ConversationConstant.SUCCESS_CODES.GET_DETAIL_CONVERSATION_SUCCESS
        })
    }

    async deleteConversation(req, res) {
        const conversationId = req.params.id
        await ConversationValidator.validateGetConversation({ conversationId })
        await ConversationService.deleteConversation(conversationId)
        res.status(200).send({
            message: ConversationConstant.SUCCESS_CODES.DELETE_CONVERSATION_SUCCESS
        })
    }

    /* message of conversation */
    async createConversationMessage(req, res) {
        const conversationId = req.params.id
        const { type, body, senderId } = req.body
        const { sender } = await ConversationValidator.validateCreateConversationMessage({
            conversationId,
            type,
            body,
            senderId
        })
        const createData = {
            conversation: conversationId,
            sender: senderId,
            body
        }
        const createMessage = await MessageService.createMessage(createData, false)
        /* update latestMessage for conversation */
        const messageObject = createMessage.toObject()
        messageObject.id = messageObject._id
        delete messageObject._id
        const updateData = { latestMessage: messageObject }
        const newConversation = await ConversationService.updateConversation(conversationId, updateData)
        return res.status(201).send({
            data: {
                conversation: newConversation,
                status: createMessage.status,
                body,
                type,
                sender,
                latestMessage: messageObject
            },
            message: ConversationConstant.SUCCESS_CODES.CREATE_MESSAGE_SUCCESS
        })
    }

    async getConversationMessages(req, res) {
        const conversationId = req.params.id
        const { senderId } = req.query
        const filter = { conversation: conversationId }
        if (senderId) filter.sender = senderId
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const messages = await MessageService.getListMessages(filter, options)
        return res.status(200).send({
            data: messages,
            message: ConversationConstant.SUCCESS_CODES.GET_CONVERSATIONS_SUCCESS
        })
    }
}

export default new ConversationController()
