/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import HireConstant from "../constants/HireConstant"
import NotificationConstant from "../constants/NotificationConstant"
import HireValidator from "../validators/HireValidator"
import ConversationValidator from "../validators/ConversationValidator"
import HireService from "../services/HireService"
import ConversationService from "../services/ConversationService"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import NotificationService from "../services/NotificationService"
import SocketHelper from "../helpers/SocketHelper"
import PlayerInfoConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import { ROLES } from "../constants/UserConstant"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"

class HireController {
    async createHire(req, res) {
        const customerId = req.user.id
        const customer = req.user
        const { playerId, timeRent } = req.body
        const oldPlayer = await HireValidator.validateCreateHire({ customerId, playerId, timeRent, customer })
        const { costPerHour } = oldPlayer.playerInfo
        const cost = timeRent * costPerHour
        const createData = { ...req.body, customer: customerId, player: playerId, cost }
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
            receiver: playerId,
            action: NotificationConstant.ACTIONS.REQUEST_HIRE,
            href: `hires/${createHire.id}`,
            payload: {
                conversation: createConversation.id,
                hire: createHire.id
            },
            image: customerInfo.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: createHire })
        SocketHelper.sendHire({ userId: customerId, hire: createHire })
        /* create balance fluctuation */
        const dataCreate = {
            user: customerId,
            amount: cost,
            operation: BalanceFluctuationConstant.OPERATIONS.SUBTRACT,
            action: BalanceFluctuationConstant.ACTIONS.RENT_PLAYER
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreate)
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
        const userIdLogin = req.user.id

        const hire = await HireValidator.validateGetHire({ hireId })
        await HireValidator.validateAcceptHire({ userIdLogin, playerId: hire.player })
        const currentHireStep = hire.hireStep
        const action = HireConstant.HIRE_STEPS.ACCEPT
        await HireValidator.validateUpdateStatus({ currentHireStep, action })
        const updateData = {
            hireStep: HireConstant.HIRE_STEPS.ACCEPT,
            acceptedAt: new Date()
        }
        const newHire = await HireService.updateHire(hireId, updateData)
        const customerId = newHire.customer.id
        const playerId = newHire.player.id
        /* update status for Player */
        const newPlayerInfo = newHire.player.playerInfo
        newPlayerInfo.statusHire = PlayerInfoConstant.STATUS_HIRE.BUSY
        const dataUpdatePlayer = { playerInfo: newPlayerInfo }
        await UserModel.updateOne({ _id: playerId }, { $set: dataUpdatePlayer })
        /* create notify */
        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: customerId,
            action: NotificationConstant.ACTIONS.PLAYER_ACCEPT_HIRE,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
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

    async playerCancelHire(req, res) {
        const hireId = req.params.id
        const userIdLogin = req.user.id
        const { cancelReason } = req.body

        const hire = await HireValidator.validateGetHire({ hireId })
        await HireValidator.validatePlayerCancelHire({ userIdLogin, playerId: hire.player })
        const currentHireStep = hire.hireStep
        const action = HireConstant.HIRE_STEPS.PLAYER_CANCEL
        await HireValidator.validateUpdateStatus({ currentHireStep, action })

        const updateData = { hireStep: HireConstant.HIRE_STEPS.PLAYER_CANCEL, cancelReason, canceledAt: new Date() }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: customerId,
            action: NotificationConstant.ACTIONS.PLAYER_CANCEL_HIRE,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
            },
            image: newHire.player.playerInfo.playerAvatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        /* create balance fluctuation */
        const dataCreate = {
            user: customerId,
            amount: newHire.cost,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.CANCEL_HIRE
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreate)
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.CANCEL_HIRE_SUCCESS
        })
    }

    async customerCancelHire(req, res) {
        const hireId = req.params.id
        const userIdLogin = req.user.id
        const hire = await HireValidator.validateGetHire({ hireId })
        await HireValidator.validateCustomerCancelHire({ userIdLogin, customerId: hire.customer })
        const currentHireStep = hire.hireStep
        const action = HireConstant.HIRE_STEPS.CUSTOMER_CANCEL
        await HireValidator.validateUpdateStatus({ currentHireStep, action })

        const updateData = { hireStep: HireConstant.HIRE_STEPS.CUSTOMER_CANCEL, canceledAt: new Date() }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: playerId,
            action: NotificationConstant.ACTIONS.CUSTOMER_CANCEL_HIRE,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
            },
            image: newHire.customer.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        /* create balance fluctuation */
        const dataCreate = {
            user: customerId,
            amount: newHire.cost,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.CANCEL_HIRE
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreate)
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.CANCEL_HIRE_SUCCESS
        })
    }

    async finishSoonHire(req, res) {
        const userIdLogin = req.user.id
        const hireId = req.params.id
        const hire = await HireValidator.validateGetHire({ hireId })
        await HireValidator.validateRequestFinishSoon({ userIdLogin, customerId: hire.customer })
        const currentHireStep = hire.hireStep
        const action = HireConstant.HIRE_STEPS.COMPLETE
        await HireValidator.validateUpdateStatus({ currentHireStep, action })

        const updateData = { hireStep: HireConstant.HIRE_STEPS.COMPLETE, isCompleteSoon: true }
        const newHire = await HireService.updateHire(hireId, updateData)

        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id
        /* update status hire player */
        const newPlayerInfo = newHire.player.playerInfo
        newPlayerInfo.statusHire = PlayerInfoConstant.STATUS_HIRE.READY
        const dataUpdatePlayer = { playerInfo: newPlayerInfo }
        await UserModel.updateOne({ _id: playerId }, { $set: dataUpdatePlayer })

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: playerId,
            action: NotificationConstant.ACTIONS.CUSTOMER_FINISH_SOON,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
            },
            image: newHire.customer.avatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        /* create balance fluctuation */
        const dataCreate = {
            user: playerId,
            amount: newHire.cost,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_HIRE
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreate)
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.FINISH_SOON_HIRE_SUCCESS
        })
    }

    async requestComplain(req, res) {
        const userIdLogin = req.user.id
        const hireId = req.params.id
        const oldHire = await HireValidator.validateGetHire({ hireId })
        await HireValidator.validateRequestComplain({ userIdLogin, customerId: oldHire.customer })

        const currentHireStep = oldHire.hireStep
        const action = HireConstant.HIRE_STEPS.COMPLAIN
        await HireValidator.validateUpdateStatus({ currentHireStep, action })

        const updateData = { hireStep: HireConstant.HIRE_STEPS.COMPLAIN }
        const newHire = await HireService.updateHire(hireId, updateData)
        /* create notify */
        const customerId = newHire.customer.id
        const playerId = newHire.player.id

        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: playerId,
            action: NotificationConstant.ACTIONS.CUSTOMER_REQUEST_COMPLAIN,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
            },
            image: newHire.customer.avatar
        }
        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: playerId, notify })

        const usersAdmin = await UserModel.find({ roles: { $in: [ROLES.ADMIN] } }).select("_id")
        for (const userAdmin of usersAdmin) {
            createNotifyData.receiver = userAdmin.id
            const notifyAdmin = await NotificationService.createNotification(createNotifyData)
            SocketHelper.sendNotify({ userId: userAdmin.id, notify: notifyAdmin })
        }

        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })

        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.REQUEST_COMPLAIN_SUCCESS
        })
    }

    async completeHire(req, res) {
        const userIdLogin = req.user.id
        const hireId = req.params.id
        const hire = await HireValidator.validateGetHire({ hireId })
        const currentHireStep = hire.hireStep
        const action = HireConstant.HIRE_STEPS.COMPLETE
        await HireValidator.validateUpdateStatus({ currentHireStep, action })
        await HireValidator.validateComplete({ userIdLogin, playerId: hire.player, hire })

        const updateData = {
            hireStep: HireConstant.HIRE_STEPS.COMPLETE
        }
        const newHire = await HireService.updateHire(hireId, updateData)
        const customerId = newHire.customer.id
        const playerId = newHire.player.id
        /* update status hire player */
        const newPlayerInfo = newHire.player.playerInfo
        newPlayerInfo.statusHire = PlayerInfoConstant.STATUS_HIRE.READY
        const dataUpdatePlayer = { playerInfo: newPlayerInfo }
        await UserModel.updateOne({ _id: playerId }, { $set: dataUpdatePlayer })
        /* create notify */
        const createNotifyData = {
            customer: customerId,
            player: playerId,
            receiver: customerId,
            action: NotificationConstant.ACTIONS.COMPLETE,
            href: `hires/${newHire.id}`,
            payload: {
                conversation: newHire.conversation,
                hire: hireId
            },
            image: newHire.player.playerInfo.playerAvatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        /* create balance fluctuation */
        const dataCreate = {
            user: playerId,
            amount: newHire.cost,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_HIRE
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreate)
        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.COMPLETE_HIRE_SUCCESS
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
