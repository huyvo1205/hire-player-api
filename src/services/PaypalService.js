import Paypal from "paypal-rest-sdk"
import * as CreateError from "http-errors"
import payoutsSdk from "@paypal/payouts-sdk"
import PassportPaypal from "passport-paypal"
import Config from "../config/config"
import TransactionConstant from "../constants/TransactionConstant"

const PayPalStrategy = PassportPaypal.Strategy

const environment = new payoutsSdk.core.SandboxEnvironment(Config.PAYPAL.CLIENT_ID, Config.PAYPAL.CLIENT_SECRET)
const client = new payoutsSdk.core.PayPalHttpClient(environment)
Paypal.configure({
    mode: "sandbox", // sandbox or live
    client_id: Config.PAYPAL.CLIENT_ID,
    client_secret: Config.PAYPAL.CLIENT_SECRET
})
class PaypalService {
    generateCredentialsPayPalStrategy() {
        const credential = new PayPalStrategy(
            {
                returnURL: "http://localhost:3000/auth/paypal/return",
                realm: "http://localhost:3000/"
            },
            (identifier, profile, done) => {
                // asynchronous verification, for effect...
                console.log("profile", profile)
                process.nextTick(() => {
                    // To keep the example simple, the user's PayPal profile is returned to
                    // represent the logged-in user.  In a typical application, you would want
                    // to associate the PayPal account with a user record in your database,
                    // and return that user instead.
                    profile.identifier = identifier
                    return done(null, profile)
                })
            }
        )

        return credential
    }

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

    createPayoutJson({ amount, email }) {
        const senderBatchId = `HirePlayerApp_${Math.random().toString(36).substring(7)}`
        return {
            sender_batch_header: {
                recipient_type: "EMAIL",
                email_message: "Payout HirePlayerApp",
                note: "Payout HirePlayerApp",
                sender_batch_id: senderBatchId,
                email_subject: "This is a Payout HirePlayerApp"
            },
            items: [
                {
                    note: `Your ${amount}$ Payout!`,
                    amount: {
                        currency: "USD",
                        value: amount
                    },
                    receiver: email,
                    sender_item_id: ` ${senderBatchId}_${+new Date()}`
                }
            ]
        }
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

    async createPayoutPaypal(createPayoutJson) {
        try {
            const request = new payoutsSdk.payouts.PayoutsPostRequest()
            request.requestBody(createPayoutJson)
            const response = await client.execute(request)
            return response.result
        } catch (error) {
            console.log("error", JSON.stringify(error))
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_CREATE_PAYOUT_PAYPAL_FAIL)
        }
    }

    async getPayoutPaypal(batchId) {
        try {
            const request = new payoutsSdk.payouts.PayoutsGetRequest(batchId)
            const response = await client.execute(request)
            if (response.statusCode === 200) {
                return response.result
            }
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_GET_PAYOUT_PAYPAL_FAIL)
        } catch (error) {
            console.error("getPayoutPaypal error: ", error)
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_GET_PAYOUT_PAYPAL_FAIL)
        }
    }

    async getPayoutItemPaypal(itemId) {
        try {
            const request = new payoutsSdk.payouts.PayoutsItemGetRequest(itemId)
            const response = await client.execute(request)
            if (response.statusCode === 200) {
                return response.result
            }
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_GET_PAYOUT_ITEM_PAYPAL_FAIL)
        } catch (error) {
            console.error("getPayoutPaypal error: ", error)
            throw new CreateError.InternalServerError(TransactionConstant.ERROR_CODES.ERROR_GET_PAYOUT_ITEM_PAYPAL_FAIL)
        }
    }
}

export default new PaypalService()
