import PaypalService from "../services/PaypalService"
import Config from "../config/config"
import TransactionConstant from "../constants/TransactionConstant"
import TransactionValidator from "../validators/TransactionValidator"

class TransactionController {
    async recharge(req, res) {
        const { method, userId } = req.body
        if (method === TransactionConstant.METHOD.PAYPAL) {
            await TransactionValidator.validateRechargePaypal({ userId })
        }
        const createPaymentJson = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${Config.BASE_URL}${Config.PAYPAL.PAYPAL_SUCCESS_URL}?code=123`,
                cancel_url: `${Config.BASE_URL}${Config.PAYPAL.PAYPAL_CANCEL_URL}?code=123`
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: "Recharge into HirePlayer App",
                                sku: "00002",
                                price: "25.00",
                                currency: "USD",
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: "USD",
                        total: "25.00"
                    },
                    description: "This is the payment description TEST."
                }
            ]
        }
        const result = await PaypalService.createPaymentPaypal(createPaymentJson)
        if (result && result.links && result.links.length) {
            const approvalUrl = result.links.find(link => link.rel === "approval_url")
            if (approvalUrl) return res.status(200).send({ data: approvalUrl })
        }
        return res.status(200).send({ data: {} })
    }

    async rechargeSuccess(req, res) {
        const { PayerID, paymentId } = req.query

        const executePaymentJson = {
            payer_id: PayerID,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: "25.00"
                    }
                }
            ]
        }

        const results = await PaypalService.executePaymentPaypal(paymentId, executePaymentJson)
        return res.status(200).send({ data: results })
    }

    async rechargeCancel(req, res) {
        return res.status(200).send({ data: {}, message: "cancel" })
    }
}

export default new TransactionController()
