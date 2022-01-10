import DonateConstant from "../constants/DonateConstant"
import DonateValidator from "../validators/DonateValidator"
import DonateService from "../services/DonateService"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import pick from "../utils/pick"

class DonateController {
    async createDonate(req, res) {
        const userIdLogin = req.user.id
        const { toUser, amount } = req.body
        await DonateValidator.validateCreateDonate({ fromUser: req.user, toUser, amount })
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
            action: BalanceFluctuationConstant.ACTIONS.DONATE
        }
        const dataCreateBalanceToUser = {
            user: toUser,
            amount: newDonate.amount,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.RECEIVE_MONEY_DONATE
        }
        await BalanceFluctuationService.createBalanceFluctuation(dataCreateBalanceFromUser)
        await BalanceFluctuationService.createBalanceFluctuation(dataCreateBalanceToUser)
        return res.status(201).send({
            message: DonateConstant.SUCCESS_CODES.CREATE_DONATE_SUCCESS
        })
    }
}

export default new DonateController()
