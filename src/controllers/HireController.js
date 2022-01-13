/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as _ from "lodash"
import HireConstant from "../constants/HireConstant"
import NotificationConstant from "../constants/NotificationConstant"
import HireValidator from "../validators/HireValidator"
import ConversationValidator from "../validators/ConversationValidator"
import ReviewValidator from "../validators/ReviewValidator"
import HireService from "../services/HireService"
import ConversationService from "../services/ConversationService"
import ReviewService from "../services/ReviewService"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import NotificationService from "../services/NotificationService"
import SocketHelper from "../helpers/SocketHelper"
import PlayerInfoConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import ConversationModel from "../models/ConversationModel"
import { ROLES } from "../constants/UserConstant"
import ReviewConstant from "../constants/ReviewConstant"
import ReviewHelper from "../helpers/ReviewHelper"
import MessageService from "../services/MessageService"
import PlayerService from "../services/PlayerService"
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
        /* create message */
        const createDataMessage = {
            conversation: createConversation.id,
            sender: customerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.CUSTOMER_HIRE
            }
        }
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation: createConversation,
            message: createMessage,
            userIdLogin: customerId,
            sender: customer
        })
        createConversation = _.cloneDeep(dataRes.conversation)
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
        createConversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })
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
        const player = req.user

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
        const dataUpdatePlayer = { "playerInfo.statusHire": PlayerInfoConstant.STATUS_HIRE.BUSY }
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.PLAYER_ACCEPT_HIRE
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: player
        })

        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })

        res.status(200).send({
            data: newHire,
            message: HireConstant.SUCCESS_CODES.ACCEPT_HIRE_SUCCESS
        })
    }

    async playerCancelHire(req, res) {
        const hireId = req.params.id
        const userIdLogin = req.user.id
        const player = req.user
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.PLAYER_CANCEL_HIRE
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: player
        })
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })
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
        const customer = req.user
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.CUSTOMER_CANCEL_HIRE
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: customer
        })
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })
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
        const customer = req.user
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
        const dataUpdatePlayer = { "playerInfo.statusHire": PlayerInfoConstant.STATUS_HIRE.READY }
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.CUSTOMER_FINISH_SOON_HIRE
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: customer
        })
        SocketHelper.sendNotify({ userId: playerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })
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
        const customer = req.user
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.CUSTOMER_REQUEST_COMPLAIN
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: customer
        })
        SocketHelper.sendNotify({ userId: playerId, notify })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })
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
        const player = req.user
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
        const dataUpdatePlayer = { "playerInfo.statusHire": PlayerInfoConstant.STATUS_HIRE.READY }
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
        /* create message */
        const createDataMessage = {
            conversation: newHire.conversation,
            sender: playerId,
            body: {
                content: HireConstant.HIRE_STEPS_MESSAGE.PLAYER_COMPLETE_HIRE
            }
        }
        const conversation = await ConversationModel.findById(newHire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: player
        })
        SocketHelper.sendNotify({ userId: customerId, notify })
        SocketHelper.sendHire({ userId: playerId, hire: newHire })
        SocketHelper.sendHire({ userId: customerId, hire: newHire })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })

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

    async reviewHire(req, res) {
        const userIdLogin = req.user.id
        const userLogin = req.user
        const hireId = req.params.id
        const { starPoint, content } = req.body
        const hire = await HireValidator.validateGetHire({ hireId })
        const { customer } = hire
        await ReviewValidator.validateCreateReview({ customer, reviewer: userIdLogin, hireId, hire })
        const dataCreateReview = {
            reviewer: userIdLogin,
            receiver: hire.player,
            starPoint,
            content,
            timeRent: hire.timeRent,
            hire: hire.id
        }
        const newReview = await ReviewService.createReview(dataCreateReview)
        /* update avg rating for player */
        const userId = hire.player
        const avgRating = await ReviewHelper.calculateAvgRating({ userId })
        const updateDataPlayer = { "playerInfo.avgRating": avgRating }
        await PlayerService.updatePlayerInfo(userId, updateDataPlayer)
        /* create notify */
        const createNotifyData = {
            customer: hire.customer,
            player: hire.player,
            receiver: hire.player,
            action: NotificationConstant.ACTIONS.REVIEW,
            href: `hires/${hire.id}`,
            payload: {
                conversation: hire.conversation,
                hire: hireId,
                review: newReview.id
            },
            image: userLogin.playerInfo.playerAvatar
        }

        const notify = await NotificationService.createNotification(createNotifyData)
        /* create message */
        const createDataMessage = {
            conversation: hire.conversation,
            sender: userIdLogin,
            body: {
                content: `${HireConstant.HIRE_STEPS_MESSAGE.CUSTOMER_REVIEW_HIRE} ${newReview.starPoint} star`
            }
        }
        const conversation = await ConversationModel.findById(hire.conversation)
        const createMessage = await MessageService.createMessage(createDataMessage, false)
        const dataRes = await ConversationService.updateLatestMessageConversation({
            conversation,
            message: createMessage,
            userIdLogin,
            sender: userIdLogin
        })
        SocketHelper.sendNotify({ userId: hire.player, notify })
        dataRes.conversation.members.forEach(member => {
            SocketHelper.sendMessage({ userId: member, message: dataRes })
        })

        res.status(201).send({
            data: newReview,
            message: ReviewConstant.SUCCESS_CODES.CREATE_REVIEW_SUCCESS
        })
    }
}

export default new HireController()
