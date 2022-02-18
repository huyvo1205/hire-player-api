import * as CreateError from "http-errors"
import PaypalService from "../services/PaypalService"
import WithdrawService from "../services/WithdrawService"
import WithdrawValidator from "../validators/WithdrawValidator"
import RechargeConstant from "../constants/RechargeConstant"
import WithdrawConstant from "../constants/WithdrawConstant"
import CommonHelper from "../helpers/CommonHelper"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import pick from "../utils/pick"

class WithdrawController {
    async getWithdrawFees(req, res) {
        return res.status(200).send({
            data: {
                paypal: WithdrawConstant.PAYOUT_FEE
            },
            message: WithdrawConstant.SUCCESS_CODES.GET_WITHDRAW_FEES_SUCCESS
        })
    }

    async getWithdraws(req, res) {
        const userIdLogin = req.user.id
        const filter = { user: userIdLogin }
        const select = "-payload"
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        options.select = select
        const withdraws = await WithdrawService.getListWithdraws(filter, options)
        return res.status(200).send({
            data: withdraws,
            message: WithdrawConstant.SUCCESS_CODES.GET_WITHDRAWS_SUCCESS
        })
    }

    async withdrawWithPaypal(req, res) {
        const userLogin = req.user
        const { amount, email } = req.body
        const totalAmount = amount + WithdrawConstant.PAYOUT_FEE
        await WithdrawValidator.validateWithdraw({ totalAmount, money: userLogin.money })
        const payoutJson = PaypalService.createPayoutJson({ amount, email })
        const result = await PaypalService.createPayoutPaypal(payoutJson)
        let i = 0
        const dataCreateWithdraw = {
            method: WithdrawConstant.METHODS.PAYPAL,
            user: userLogin.id,
            email,
            amount,
            timeWithdraw: new Date()
        }

        do {
            await CommonHelper.timeout(100)
            const { payout_batch_id: payoutBatchId } = result.batch_header
            const payout = await PaypalService.getPayoutPaypal(payoutBatchId)
            if (!payout)
                return res.status(400).send({ message: WithdrawConstant.ERROR_CODES.ERROR_PAYOUT_PAYPAL_NOT_FOUND })
            const { batch_status: batchStatus } = payout.batch_header
            const payoutItems = payout.items
            dataCreateWithdraw.key = payoutBatchId
            dataCreateWithdraw.payout = payout

            if (batchStatus === WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS.SUCCESS) {
                /*  validate transaction_status */
                await CommonHelper.timeout(50)
                const item = payoutItems[0]
                const { payout_item_id: payoutItemId } = item
                const payoutItem = await PaypalService.getPayoutItemPaypal(payoutItemId)

                const { transaction_status: transactionStatus } = payoutItem
                const invalidStatus = [
                    WithdrawConstant.TRANSACTION_STATUS.FAILED,
                    WithdrawConstant.TRANSACTION_STATUS.PENDING,
                    WithdrawConstant.TRANSACTION_STATUS.RETURNED,
                    WithdrawConstant.TRANSACTION_STATUS.BLOCKED,
                    WithdrawConstant.TRANSACTION_STATUS.REFUNDED,
                    WithdrawConstant.TRANSACTION_STATUS.REVERSED
                ]

                const listBatchStatus = Object.values(WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS)
                const isValidStatus = invalidStatus.includes(transactionStatus)
                let error = false
                let message = ""

                if (transactionStatus === WithdrawConstant.TRANSACTION_STATUS.UNCLAIMED) {
                    error = true
                    message = WithdrawConstant.ERROR_CODES.ERROR_EMAIL_INVALID
                }

                if (isValidStatus) {
                    error = true
                    message = WithdrawConstant.ERROR_CODES.ERROR_WITHDRAW_PAYPAL_FAIL
                }

                if (error) {
                    const newPayout = await PaypalService.getPayoutPaypal(payoutBatchId)
                    dataCreateWithdraw.payload = newPayout
                    const { batch_status: newBatchStatus } = newPayout.batch_header
                    dataCreateWithdraw.status = listBatchStatus.includes(newBatchStatus)
                        ? newBatchStatus
                        : WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS.FAILED
                    await WithdrawService.createWithdraw(dataCreateWithdraw)
                    return res.status(400).send({ message })
                }

                const newPayout = await PaypalService.getPayoutPaypal(payoutBatchId)
                dataCreateWithdraw.payload = newPayout
                const { batch_status: newBatchStatus } = newPayout.batch_header
                dataCreateWithdraw.status = listBatchStatus.includes(newBatchStatus)
                    ? newBatchStatus
                    : WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS.FAILED
                await WithdrawService.createWithdraw(dataCreateWithdraw)
                /* create balance fluctuation */
                const dataCreateBalance = {
                    user: userLogin.id,
                    amount: totalAmount,
                    operation: BalanceFluctuationConstant.OPERATIONS.SUBTRACT,
                    action: BalanceFluctuationConstant.ACTIONS.WITHDRAW
                }
                await BalanceFluctuationService.createBalanceFluctuationNotSession(dataCreateBalance)
                return res.status(200).send({ message: WithdrawConstant.SUCCESS_CODES.WITHDRAW_PAYPAL_SUCCESS })
            }

            i += 1
            console.log("i", i)
        } while (i < 10)

        dataCreateWithdraw.status = WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS.FAILED
        await WithdrawService.createWithdraw(dataCreateWithdraw)
        return res.status(400).send({ message: WithdrawConstant.ERROR_CODES.ERROR_WITHDRAW_PAYPAL_FAIL })
    }

    async hookPaypal(req, res) {
        const data = req.body
        return res.status(200).send({ data, message: RechargeConstant.SUCCESS_CODES.RECHARGE_CANCEL })
    }
}

export default new WithdrawController()
