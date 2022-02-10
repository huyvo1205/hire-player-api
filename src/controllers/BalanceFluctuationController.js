import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import pick from "../utils/pick"

class BalanceFluctuationController {
    async getBalanceFluctuations(req, res) {
        const userIdLogin = req.user.id
        const filter = { user: userIdLogin }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const balanceFluctuations = await BalanceFluctuationService.getListBalanceFluctuations(filter, options)
        return res.status(200).send({
            data: balanceFluctuations,
            message: BalanceFluctuationConstant.SUCCESS_CODES.GET_BALANCE_FLUCTUATIONS_SUCCESS
        })
    }
}

export default new BalanceFluctuationController()
