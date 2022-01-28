import Paypal from "paypal-rest-sdk"
import * as CreateError from "http-errors"
import Config from "../config/config"
import TransactionConstant from "../constants/TransactionConstant"

Paypal.configure({
    mode: "sandbox", // sandbox or live
    client_id: Config.PAYPAL.CLIENT_ID,
    client_secret: Config.PAYPAL.CLIENT_SECRET
})
class PaypalService {
    createPaymentJson({ amount, userId }) {
        const createPaymentJson = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${Config.BASE_URL}${Config.PAYPAL.PAYPAL_SUCCESS_URL}?userId=${userId}`,
                cancel_url: `${Config.BASE_URL}${Config.PAYPAL.PAYPAL_CANCEL_URL}?userId=${userId}`
            },
            application_context: {
                shipping_preference: "NO_SHIPPING"
            },
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: amount
                    },
                    description: "Recharge to HirePlayerApp"
                }
            ]
        }
        return createPaymentJson
    }

    async createPaymentPaypal(createPaymentJson) {
        try {
            return new Promise((resolve, reject) => {
                Paypal.payment.create(createPaymentJson, (error, payment) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(payment)
                    }
                })
            })
        } catch (error) {
            console.log("error", JSON.stringify(error))
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_CREATE_PAYMENT_PAYPAL_FAIL)
        }
    }

    async executePaymentPaypal(paymentId, executePaymentJson) {
        try {
            return new Promise((resolve, reject) => {
                Paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(payment)
                    }
                })
            })
        } catch (error) {
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_EXECUTE_PAYMENT_PAYPAL_FAIL)
        }
    }

    async getPayerID(paymentId) {
        try {
            return new Promise((resolve, reject) => {
                Paypal.payment.get(paymentId, (error, payment) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(payment)
                    }
                })
            })
        } catch (error) {
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_GET_PAYMENT_PAYPAL_FAIL)
        }
    }
}

export default new PaypalService()
