/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import ConversationConstant from "../constants/ConversationConstant"
import ConversationValidator from "../validators/ConversationValidator"
import HireValidator from "../validators/HireValidator"
import UserValidator from "../validators/UserValidator"
import ConversationService from "../services/ConversationService"
import MessageService from "../services/MessageService"
import pick from "../utils/pick"
import ConversationHelper from "../helpers/ConversationHelper"
import NotificationService from "../services/NotificationService"
import NotificationConstant from "../constants/NotificationConstant"
import { ROLES } from "../constants/UserConstant"
import { UserModel } from "../models"

class ConversationController {
    async getConversations(req, res) {
        const userIdLogin = req.user.id
        const { playerId, customerId, status, searchText, ignoreIds } = req.query
        const filter = await ConversationHelper.getConversationFilter({
            playerId,
            customerId,
            status,
            searchText,
            ignoreIds,
            userIdLogin
        })
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
        const userIdLogin = req.user.id
        const conversationId = req.params.id
        const { body } = req.body
        const { sender, conversation: oldConversation } = await ConversationValidator.validateCreateConversationMessage(
            {
                conversationId,
                senderId: userIdLogin
            }
        )
        const createData = {
            conversation: conversationId,
            sender: userIdLogin,
            body
        }
        const createMessage = await MessageService.createMessage(createData, false)
        /* update latestMessage for conversation */
        const messageObject = createMessage.toObject()
        messageObject.id = messageObject._id
        messageObject.unreadStatus = oldConversation.members.reduce(
            (preValue, currentValue) => ({ ...preValue, [currentValue]: 1 }),
            {}
        )
        delete messageObject.unreadStatus[`${userIdLogin}`]
        delete messageObject._id

        const updateData = { latestMessage: messageObject }
        const newConversation = await ConversationService.updateConversation(conversationId, updateData)
        const dataRes = {
            conversation: newConversation,
            body,
            sender,
            latestMessage: messageObject
        }

        newConversation.members.forEach(member => {
            const socketIds = global.UsersOnline[`${member.toString()}`] || []
            socketIds.forEach(socketId => {
                if (socketId) {
                    /* emit event when user online */
                    global.io.to(socketId).emit("onMessages", dataRes)
                }
            })
        })

        return res.status(201).send({
            data: dataRes,
            message: ConversationConstant.SUCCESS_CODES.CREATE_MESSAGE_SUCCESS
        })
    }

    async getConversationMessages(req, res) {
        const userIdLogin = req.user.id
        const conversationId = req.params.id
        await ConversationValidator.validateUserInConversation({ conversationId, userIdLogin })
        const { senderId, latestMessageId } = req.query
        const filter = { conversation: conversationId }
        if (senderId) filter.sender = senderId
        if (latestMessageId) {
            filter._id = { $lt: latestMessageId }
        }
        const options = pick(req.query, ["sortBy", "limit", "populate"])
        const messages = await MessageService.getListMessages(filter, options)
        return res.status(200).send({
            data: messages,
            message: ConversationConstant.SUCCESS_CODES.GET_CONVERSATIONS_SUCCESS
        })
    }

    async readerMessages(req, res) {
        const conversationId = req.params.id
        const userIdLogin = req.user.id
        const conversation = await ConversationValidator.validateUserInConversation({ conversationId, userIdLogin })
        const newLatestMessage = { ...conversation.latestMessage }
        const newUnreadStatus = { ...newLatestMessage.unreadStatus }
        delete newUnreadStatus[`${userIdLogin}`]
        newLatestMessage.unreadStatus = newUnreadStatus
        const dataUpdate = { latestMessage: newLatestMessage }
        const newConversation = await ConversationService.updateConversation(conversationId, dataUpdate)
        newConversation.members.forEach(member => {
            const socketIds = global.UsersOnline[`${member.toString()}`] || []
            socketIds.forEach(socketId => {
                if (socketId) {
                    /* emit event when user online */
                    global.io.to(socketId).emit("onConversations", newConversation)
                }
            })
        })

        return res.status(200).send({
            message: ConversationConstant.SUCCESS_CODES.READER_MESSAGES_SUCCESS
        })
    }

    async handleComplainConversation(req, res) {
        const conversationId = req.params.id
        const { user } = req
        const { hireId } = req.body
        const conversation = await ConversationValidator.validateGetConversation({ conversationId })
        await HireValidator.validateGetHire({ hireId })
        /* create notify */
        const createNotifyData = {
            customer: conversation.customer,
            player: conversation.player,
            action: NotificationConstant.ACTIONS.REQUEST_COMPLAIN,
            href: `hires/${conversationId}`,
            payload: {
                conversation: conversation.id,
                hire: hireId
            },
            image: user.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        /* get users admin */
        const usersAdmin = await UserModel.find({ roles: { $in: [ROLES.ADMIN] } }).select("_id")
        for (const userAdmin of usersAdmin) {
            const socketIds = global.UsersOnline[`${userAdmin.id}`] || []
            socketIds.forEach(socketId => {
                if (socketId) {
                    global.io.to(socketId).emit("onNotifications", notify)
                }
            })
        }
        return res.status(200).send({
            data: {},
            message: ConversationConstant.SUCCESS_CODES.CREATE_COMPLAIN_SUCCESS
        })
    }
}

export default new ConversationController()
