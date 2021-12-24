import HireConstant from "../constants/HireConstant"
import NotificationConstant from "../constants/NotificationConstant"
import HireValidator from "../validators/HireValidator"
import ConversationValidator from "../validators/ConversationValidator"
import HireService from "../services/HireService"
import ConversationService from "../services/ConversationService"
import NotificationService from "../services/NotificationService"

class HireController {
    async createHire(req, res) {
        const { playerId, customerId } = req.body
        await HireValidator.validateCreateHire({ playerId, customerId })

        const createData = { ...req.body, customer: customerId, player: playerId }
        /* create conversation */
        const dataCreateConversation = {
            members: [playerId, customerId],
            customer: customerId,
            player: playerId
        }
        const conversation = await ConversationValidator.validateCreateConversation({ playerId, customerId })
        let createConversation = conversation

        if (!conversation) {
            createConversation = await ConversationService.createConversation(dataCreateConversation, true)
        }

        createData.conversation = createConversation.id
        const createHire = await HireService.createHire(createData, false)
        const { customer: customerInfo } = createConversation
        /* create notify */
        const createNotifyData = {
            customer: customerId,
            player: playerId,
            content: `${customerInfo.userName} request hire you.`,
            action: NotificationConstant.ACTIONS.REQUEST_HIRE,
            href: `hires/${createHire.id}`,
            payload: {
                conversationId: createConversation.id,
                hireId: createHire.id
            },
            image: customerInfo.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        const socketId = global.UsersOnline[`${playerId}`] || null
        if (socketId) {
            /* emit event when user online */
            global.io.to(socketId).emit("onNotifications", notify)
        }
        return res.status(201).send({
            data: {
                hire: createHire,
                conversation: createConversation
            },
            message: HireConstant.SUCCESS_CODES.CREATE_HIRE_SUCCESS
        })
    }

    async getDetailHire(req, res) {
        const hireId = req.params.id
        await HireValidator.validateGetHire({ hireId })
        const hire = await HireService.getDetailHire(hireId)
        res.status(200).send({
            data: hire,
            message: HireConstant.SUCCESS_CODES.GET_DETAIL_HIRE_SUCCESS
        })
    }
}

export default new HireController()
