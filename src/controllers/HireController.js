import HireConstant from "../constants/HireConstant"
import NotificationConstant from "../constants/NotificationConstant"
import HireValidator from "../validators/HireValidator"
import ConversationValidator from "../validators/ConversationValidator"
import HireService from "../services/HireService"
import ConversationService from "../services/ConversationService"
import NotificationService from "../services/NotificationService"
import SocketHelper from "../helpers/SocketHelper"

class HireController {
    async createHire(req, res) {
        const customerId = req.user.id
        const { playerId, timeRent } = req.body
        await HireValidator.validateCreateHire({ playerId, timeRent })

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
        const createHire = await HireService.createHire(createData)
        const { customer: customerInfo } = createConversation
        /* create notify */
        const createNotifyData = {
            customer: customerId,
            player: playerId,
            action: NotificationConstant.ACTIONS.REQUEST_HIRE,
            href: `hires/${createHire.id}`,
            payload: {
                conversationId: createConversation.id,
                hireId: createHire.id
            },
            image: customerInfo.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: createHire })
        SocketHelper.sendHire({ userId: customerId, hire: createHire })
        return res.status(201).send({
            data: {
                hire: createHire,
                conversation: createConversation
            },
            message: HireConstant.SUCCESS_CODES.CREATE_HIRE_SUCCESS
        })
    }

    async acceptHire(req, res) {
        const hireId = req.params.id
        await HireValidator.validateGetHire({ hireId })
        const updateData = { hireStep: HireConstant.HIRE_STEPS.ACCEPT }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            action: NotificationConstant.ACTIONS.PLAYER_ACCEPT_HIRE,
            href: `hires/${newHire.id}`,
            payload: {
                conversationId: newHire.conversation,
                hireId
            },
            image: newHire.player.playerInfo.playerAvatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.ACCEPT_HIRE_SUCCESS
        })
    }

    async cancelHire(req, res) {
        const hireId = req.params.id
        const { cancelReason } = req.body
        await HireValidator.validateGetHire({ hireId })
        const updateData = { hireStep: HireConstant.HIRE_STEPS.PLAYER_CANCEL, cancelReason }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            action: NotificationConstant.ACTIONS.PLAYER_CANCEL_HIRE,
            href: `hires/${newHire.id}`,
            payload: {
                conversationId: newHire.conversation,
                hireId
            },
            image: newHire.player.playerInfo.playerAvatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.CANCEL_HIRE_SUCCESS
        })
    }

    async finishSoonHire(req, res) {
        const hireId = req.params.id
        await HireValidator.validateGetHire({ hireId })
        const updateData = { hireStep: HireConstant.HIRE_STEPS.COMPLETE, isCompleteSoon: true }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            action: NotificationConstant.ACTIONS.CUSTOMER_FINISH_SOON,
            href: `hires/${newHire.id}`,
            payload: {
                conversationId: newHire.conversation,
                hireId
            },
            image: newHire.customer.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.FINISH_SOON_HIRE_SUCCESS
        })
    }

    async requestComplain(req, res) {
        const hireId = req.params.id
        await HireValidator.validateGetHire({ hireId })
        const updateData = { hireStep: HireConstant.HIRE_STEPS.COMPLETE, isCompleteSoon: true }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            action: NotificationConstant.ACTIONS.CUSTOMER_FINISH_SOON,
            href: `hires/${newHire.id}`,
            payload: {
                conversationId: newHire.conversation,
                hireId
            },
            image: newHire.customer.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.FINISH_SOON_HIRE_SUCCESS
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
