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
}

export default new PaypalService()
