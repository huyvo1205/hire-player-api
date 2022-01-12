/* eslint-disable no-underscore-dangle */
import * as _ from "lodash"
import AdminConstant from "../constants/AdminConstant"
import ConversationValidator from "../validators/ConversationValidator"
import ConversationService from "../services/ConversationService"
import SocketHelper from "../helpers/SocketHelper"
import toJSON from "../models/plugins/toJSON"

class AdminController {
    async joinChat(req, res) {
        const userIdLogin = req.user.id
        const { conversationId } = req.body
        const conversationOld = await ConversationValidator.validateGetConversation({ conversationId })
        const newMembers = [...conversationOld.members]
        newMembers.push(userIdLogin)
        const updateData = { members: _.uniq(newMembers.map(item => item.toString())) }
        let newConversation = await ConversationService.updateConversation(conversationId, updateData)
        newConversation = newConversation.toJSON()
        newConversation.isAdmin = true

        newConversation.members.forEach(member => {
            SocketHelper.sendConversation({ userId: member, conversation: newConversation })
        })
        res.status(200).send({
            data: newConversation,
            message: AdminConstant.SUCCESS_CODES.JOIN_CHAT_SUCCESS
        })
    }

    async leaveChat(req, res) {
        const userIdLogin = req.user.id
        const { conversationId } = req.body
        const conversationOld = await ConversationValidator.validateGetConversation({ conversationId })
        const newMembers = conversationOld.members.filter(oldMemberId => oldMemberId.toString() !== userIdLogin)
        const updateData = { members: _.uniq(newMembers.map(item => item.toString())) }
        const newConversation = await ConversationService.updateConversation(conversationId, updateData)
        newConversation.isAdmin = true
        newConversation.members.forEach(member => {
            SocketHelper.sendConversation({ userId: member, conversation: newConversation })
        })
        res.status(200).send({
            data: newConversation,
            message: AdminConstant.SUCCESS_CODES.LEAVE_CHAT_SUCCESS
        })
    }
}

export default new AdminController()
