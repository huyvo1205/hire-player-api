/* eslint-disable no-unreachable */
import mongoose from "mongoose"
import DonateConstant from "../constants/DonateConstant"
import { SYSTEM_FEE } from "../constants/GlobalConstant"
import DonateValidator from "../validators/DonateValidator"
import DonateService from "../services/DonateService"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import NotificationHelper from "../helpers/NotificationHelper"
import NotificationConstant from "../constants/NotificationConstant"
import NotificationService from "../services/NotificationService"
import SocketHelper from "../helpers/SocketHelper"
import UserModel from "../models/UserModel"
import pick from "../utils/pick"

class DonateController {
    async getDonates(req, res) {
        const userIdLogin = req.user.id
        const filter = { fromUser: userIdLogin }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const donates = await DonateService.getListDonates(filter, options)
        return res.status(200).send({
            data: donates,
            message: DonateConstant.SUCCESS_CODES.GET_DONATES_SUCCESS
        })
    }

    async getReceiveDonates(req, res) {
        const userIdLogin = req.user.id
        const filter = { toUser: userIdLogin }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const donates = await DonateService.getListDonates(filter, options)
        return res.status(200).send({
            data: donates,
            message: DonateConstant.SUCCESS_CODES.GET_RECEIVE_DONATES_SUCCESS
        })
    }

    async getDetailDonate(req, res) {
        const donateId = req.params.id
        const donate = await DonateValidator.validateGetDonate(donateId)
        return res.status(200).send({
            data: donate,
            message: DonateConstant.SUCCESS_CODES.GET_DETAIL_DONATE_SUCCESS
        })
    }

    async createDonate(req, res, next) {
        const session = await mongoose.startSession()
        await session.startTransaction()

        try {
            const userIdLogin = req.user.id
            const userLogin = req.user
            const { toUser, amount } = req.body
            const realAmount = amount - (amount * SYSTEM_FEE) / 100
            const toUserInfo = await DonateValidator.validateCreateDonate({ fromUser: req.user, toUser, amount })
            const dataCreate = {
                ...req.body,
                fromUser: userIdLogin,
                realAmount
            }
            const newDonate = await DonateService.createDonate(dataCreate)
            /* create balance fluctuation */
            const { fromUser } = newDonate
            const dataCreateBalanceFromUser = {
                user: fromUser,
                amount: newDonate.amount,
                operation: BalanceFluctuationConstant.OPERATIONS.SUBTRACT,
                action: BalanceFluctuationConstant.ACTIONS.DONATE,
                session
            }
            const dataCreateBalanceToUser = {
                user: toUser,
                amount: newDonate.realAmount,
                operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
                action: BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_DONATE,
                session
            }
            await BalanceFluctuationService.createBalanceFluctuation(dataCreateBalanceFromUser)
            await BalanceFluctuationService.createBalanceFluctuation(dataCreateBalanceToUser)
            const createNotifyData = NotificationHelper.getDataCreateNotify({
                customer: userLogin,
                player: toUserInfo,
                receiver: { id: toUser },
                image: userLogin.avatar,
                action: NotificationConstant.ACTIONS.DONATE,
                donate: newDonate
            })

            const notify = await NotificationService.createNotification(createNotifyData)
            SocketHelper.sendNotify({ userId: toUser, notify })
            /* finish transations */
            await session.commitTransaction()
            session.endSession()
            return res.status(201).send({
                message: DonateConstant.SUCCESS_CODES.CREATE_DONATE_SUCCESS
            })
        } catch (error) {
            console.log("error", error)
            await session.abortTransaction()
            session.endSession()
            return next(error)
        }
    }

    async replyDonate(req, res, next) {
        const donateId = req.params.id
        const userLoginId = req.user.id
        const userLogin = req.user
        const { replyMessage } = req.body
        const donate = await DonateValidator.validateGetDonate(donateId)
        const { fromUser, toUser, replyMessage: oldReplyMessage } = donate
        await DonateValidator.validateReplyDonate({ toUser, userLoginId, oldReplyMessage })
        const dataUpdate = { replyMessage }
        const newDonate = await DonateService.updateDonate(donateId, dataUpdate)
        const fromUserInfo = await UserModel.findById(fromUser)
        const createNotifyData = NotificationHelper.getDataCreateNotify({
            customer: fromUserInfo,
            player: userLogin,
            receiver: { id: fromUser },
            image: userLogin.avatar,
            action: NotificationConstant.ACTIONS.REPLY_DONATE,
            donate: newDonate
        })
        const notify = await NotificationService.createNotification(createNotifyData)
        SocketHelper.sendNotify({ userId: fromUser, notify })
        return res.status(200).send({
            message: DonateConstant.SUCCESS_CODES.REPLY_DONATE_SUCCESS
        })
    }
}

export default new DonateController()
