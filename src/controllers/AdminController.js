/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import * as _ from "lodash"
import AdminConstant from "../constants/AdminConstant"
import HireConstant from "../constants/HireConstant"
import ConversationValidator from "../validators/ConversationValidator"
import ConversationService from "../services/ConversationService"
import SocketHelper from "../helpers/SocketHelper"
import NotificationService from "../services/NotificationService"
import MessageService from "../services/MessageService"
import NotificationConstant from "../constants/NotificationConstant"
import HireValidator from "../validators/HireValidator"

class AdminController {
    async joinChat(req, res) {
        const userIdLogin = req.user.id
        const userLogin = req.user
        const { conversationId } = req.body
        const conversationOld = await ConversationValidator.validateGetConversation({ conversationId })
        const newMembers = [...conversationOld.members].map(item => item.toString())
        const isSendNotify = !newMembers.includes(userIdLogin)
        newMembers.push(userIdLogin)
        const { latestHire } = conversationOld
        const hire = await HireValidator.validateGetHire({ hireId: latestHire })
        ConversationValidator.validateAdminJoinConversation({ hire })
        const updateData = { members: _.uniq(newMembers.map(item => item.toString())) }
        let newConversation = await ConversationService.updateConversation(conversationId, updateData)
        newConversation = newConversation.toJSON()
        newConversation.isAdmin = true

        newConversation.members.forEach(member => {
            SocketHelper.sendConversation({ userId: member, conversation: newConversation })
        })

        for (const member of newConversation.members) {
            /* create message */
            const createDataMessage = {
                conversation: hire.conversation,
                sender: userIdLogin,
                body: {
                    content: HireConstant.HIRE_STEPS_MESSAGE.ADMIN_JOIN_CHAT
                }
            }
            const createMessage = await MessageService.createMessage(createDataMessage, false)
            const dataRes = await ConversationService.updateLatestMessageConversation({
                conversation: conversationOld,
                message: createMessage,
                userIdLogin,
                sender: userIdLogin
            })
            SocketHelper.sendMessage({ userId: member, message: dataRes })

            if (isSendNotify) {
                /* create notify */
                const createNotifyData = {
                    customer: hire.customer,
                    player: hire.player,
                    receiver: member,
                    action: NotificationConstant.ACTIONS.ADMIN_JOIN_CHAT,
                    href: `hires/${hire.id}`,
                    payload: {
                        conversation: hire.conversation,
                        hire: hire.id
                    },
                    image: userLogin.avatar
                }
                const notify = await NotificationService.createNotification(createNotifyData)
                SocketHelper.sendNotify({ userId: member, notify })
            }
        }

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
        let newConversation = await ConversationService.updateConversation(conversationId, updateData)
        newConversation = newConversation.toJSON()
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
