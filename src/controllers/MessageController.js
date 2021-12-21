import MessageConstant from "../constants/MessageConstant"
import MessageValidator from "../validators/MessageValidator"
import MessageService from "../services/MessageService"
import pick from "../utils/pick"

class MessageController {
    async getMessages(req, res) {
        const { conversationId, senderId, status } = req.query
        const filter = {}
        if (conversationId) filter.conversation = conversationId
        if (senderId) filter.sender = senderId
        if (status) filter.status = status

        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const messages = await MessageService.getListMessages(filter, options)
        return res.status(200).send({
            data: messages,
            message: MessageConstant.SUCCESS_CODES.GET_MESSAGES_SUCCESS
        })
    }

    async createMessage(req, res) {
        const { conversationId, senderId } = req.body
        await MessageValidator.validateCreateMessage({ conversationId, senderId })

        const createData = { ...req.body, conversation: conversationId, sender: senderId }
        const createMessage = await MessageService.createMessage(createData)
        return res.status(201).send({
            data: createMessage,
            message: MessageConstant.SUCCESS_CODES.CREATE_MESSAGE_SUCCESS
        })
    }

    async updateMessage(req, res) {
        const messageId = req.params.id
        await MessageValidator.validateUpdateMessage({ messageId })
        const updateData = { ...req.body }
        const updateMessage = await MessageService.updateMessage(messageId, updateData)
        res.status(200).send({
            data: updateMessage,
            message: MessageConstant.SUCCESS_CODES.UPDATE_MESSAGE_SUCCESS
        })
    }

    async getDetailMessage(req, res) {
        const messageId = req.params.id
        await MessageValidator.validateGetMessage({ messageId })
        const message = await MessageService.getDetailMessage(messageId)
        res.status(200).send({
            data: message,
            message: MessageConstant.SUCCESS_CODES.GET_DETAIL_MESSAGE_SUCCESS
        })
    }

    async deleteMessage(req, res) {
        const messageId = req.params.id
        await MessageValidator.validateGetMessage({ messageId })
        await MessageService.deleteMessage(messageId)
        res.status(200).send({
            message: MessageConstant.SUCCESS_CODES.DELETE_MESSAGE_SUCCESS
        })
    }
}

export default new MessageController()
