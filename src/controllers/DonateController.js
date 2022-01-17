/* eslint-disable no-unreachable */
import mongoose from "mongoose"
import DonateConstant from "../constants/DonateConstant"
import DonateValidator from "../validators/DonateValidator"
import DonateService from "../services/DonateService"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import NotificationHelper from "../helpers/NotificationHelper"
import NotificationConstant from "../constants/NotificationConstant"
import NotificationService from "../services/NotificationService"
import SocketHelper from "../helpers/SocketHelper"
import pick from "../utils/pick"

class DonateController {
    async createDonate(req, res, next) {
        const session = await mongoose.startSession()
        await session.startTransaction()

        try {
            const userIdLogin = req.user.id
            const userLogin = req.user
            const { toUser, amount } = req.body
            const toUserInfo = await DonateValidator.validateCreateDonate({ fromUser: req.user, toUser, amount })
            const dataCreate = {
                ...req.body,
                fromUser: userIdLogin
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
                amount: newDonate.amount,
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
            // finish transcation
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
}

export default new DonateController()
