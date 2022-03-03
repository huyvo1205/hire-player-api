import * as CreateError from "http-errors"
import PaypalService from "../services/PaypalService"
import RechargeService from "../services/RechargeService"
import PaymentService from "../services/PaymentService"
import RechargeValidator from "../validators/RechargeValidator"
import RechargeConstant from "../constants/RechargeConstant"
import BalanceFluctuationService from "../services/BalanceFluctuationService"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"
import Config from "../config/config"

class TransactionController {
    async rechargePaypal(req, res) {
        const userIdLogin = req.user.id
        const { amount } = req.body
        // const host = req.get("host")
        const host = Config.BASE_URL
        const createPaymentJson = PaypalService.createPaymentJson({ amount, userId: userIdLogin, host })
        const result = await PaypalService.createPaymentPaypal(createPaymentJson)
        if (result && result.links && result.links.length) {
            const approvalUrl = result.links.find(link => link.rel === "approval_url")
            if (approvalUrl) return res.status(200).send({ data: approvalUrl })
        }
        return res.status(400).send({ message: RechargeConstant.ERROR_CODES.ERROR_RECHARGE_PAYPAL_FAIL })
    }

    async rechargeStripe(req, res) {
        const userIdLogin = req.user.id
        const { paymentMethodId, amount } = req.body
        const paymentMethod = await RechargeValidator.validateRechargeStripe({ paymentMethodId, userIdLogin })
        const customerId = paymentMethod.customer
        const amountConvert = amount * 100
        const payment = await PaymentService.createPaymentStripe({
            paymentMethodId,
            amount: amountConvert,
            customer: customerId
        })
        if (payment && payment.status === "succeeded") {
            const dataCreate = {
                method: RechargeConstant.METHODS.CREDIT_CARD,
                user: userIdLogin,
                payload: payment,
                key: payment.id,
                status: RechargeConstant.STATUS.SUCCESS
            }
            await RechargeService.createRecharge(dataCreate)
            /* create balance fluctuation */
            const dataCreateBalance = {
                user: userIdLogin,
                amount,
                operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
                action: BalanceFluctuationConstant.ACTIONS.RECHARGE
            }
            await BalanceFluctuationService.createBalanceFluctuationNotSession(dataCreateBalance)
            return res.status(200).send({ message: RechargeConstant.SUCCESS_CODES.RECHARGE_SUCCESS })
        }
        return res.status(400).send({ message: RechargeConstant.ERROR_CODES.ERROR_RECHARGE_STRIPE_FAIL })
    }

    async rechargeGooglePay(req, res) {
        const { amount } = req.body
        const amountConvert = amount * 100
        const params = {
            payment_method_types: ["card"],
            amount: amountConvert,
            currency: "usd"
        }

        // if (paymentMethodType === "acss_debit") {
        //     params.payment_method_options = {
        //         acss_debit: {
        //             mandate_options: {
        //                 payment_schedule: "sporadic",
        //                 transaction_type: "personal"
        //             }
        //         }
        //     }
        // }

        const paymentIntent = await PaymentService.createPaymentIntentsStripe(params)

        return res.status(200).send({
            data: { clientSecret: paymentIntent.client_secret },
            message: RechargeConstant.SUCCESS_CODES.CREATE_PAYMENT_INTENTS_STRIPE_SUCCESS
        })
    }

    async rechargeGooglePayVerify(req, res) {
        const userIdLogin = req.user.id
        const { paymentIntentId } = req.body
        const paymentIntent = await PaymentService.retrievePaymentIntentsStripe(paymentIntentId)
        await RechargeValidator.validateRechargeGooglePay({ paymentIntent })

        const dataCreate = {
            method: RechargeConstant.METHODS.CREDIT_CARD,
            user: userIdLogin,
            payload: paymentIntent,
            key: paymentIntent.id,
            status: RechargeConstant.STATUS.SUCCESS
        }

        await RechargeService.createRecharge(dataCreate)
        /* create balance fluctuation */
        const amountConvert = paymentIntent.amount / 100
        const dataCreateBalance = {
            user: userIdLogin,
            amount: amountConvert,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.RECHARGE
        }
        await BalanceFluctuationService.createBalanceFluctuationNotSession(dataCreateBalance)
        return res.status(200).send({ message: RechargeConstant.SUCCESS_CODES.RECHARGE_SUCCESS })
    }

    async rechargeRazorpay(req, res) {
        const { amount } = req.body
        const amountConvert = amount * 100
        const order = await PaymentService.createOrderRazorpay({ amount: amountConvert })
        return res.status(200).send({ data: order, message: RechargeConstant.SUCCESS_CODES.RECHARGE_SUCCESS })
    }

    async rechargeRazorpayVerify(req, res) {
        const userIdLogin = req.user.id
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body
        const payment = await RechargeValidator.validateRechargeRazorpay({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        })
        const dataCreate = {
            method: RechargeConstant.METHODS.RAZOR_PAY,
            user: userIdLogin,
            payload: payment,
            key: payment.id,
            status: RechargeConstant.STATUS.SUCCESS
        }
        await RechargeService.createRecharge(dataCreate)
        /* create balance fluctuation */
        const amountConvert = payment.amount / 100
        const dataCreateBalance = {
            user: userIdLogin,
            amount: amountConvert,
            operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
            action: BalanceFluctuationConstant.ACTIONS.RECHARGE
        }
        await BalanceFluctuationService.createBalanceFluctuationNotSession(dataCreateBalance)
        return res.status(200).send({ message: RechargeConstant.SUCCESS_CODES.RECHARGE_SUCCESS })
    }

    async rechargeSuccess(req, res) {
        const { PayerID, paymentId, userId } = req.query
        const executePaymentJson = {
            payer_id: PayerID
        }

        const results = await PaypalService.executePaymentPaypal(paymentId, executePaymentJson)
        if (results && results.state === "approved") {
            const amount = results.transactions.length ? results.transactions[0].amount.total : 0
            if (!amount) throw new CreateError.BadRequest(RechargeConstant.ERROR_CODES.ERROR_AMOUNT_INVALID)
            const dataCreate = {
                method: RechargeConstant.METHODS.PAYPAL,
                user: userId,
                payload: results,
                key: results.id,
                status: RechargeConstant.STATUS.SUCCESS
            }
            await RechargeService.createRecharge(dataCreate)
            /* create balance fluctuation */
            const dataCreateBalance = {
                user: userId,
                amount,
                operation: BalanceFluctuationConstant.OPERATIONS.PLUS,
                action: BalanceFluctuationConstant.ACTIONS.RECHARGE
            }
            await BalanceFluctuationService.createBalanceFluctuationNotSession(dataCreateBalance)
        }
        return res.redirect("/paypal-recharge-success")
    }

    async rechargeCancel(req, res) {
        return res.redirect("/paypal-recharge-cancel")
    }
}

export default new TransactionController()
