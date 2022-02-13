import express from "express"
import RechargeController from "../controllers/RechargeController"
import { validateBody } from "../validators"
import TransactionSchema from "../schemas/TransactionSchema"
import auth from "../middlewares/auth"
import "express-async-errors"

const router = express.Router()
/**
 * @swagger
 * /api/recharges/paypal:
 *   post:
 *     summary: Recharges With Paypal
 *     security:
 *       - bearerAuth: []
 *     tags: [Recharges With Paypal]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: amount
 *         description: "amount, minimum: 1"
 *         in: body
 *         required: true
 *         schema:
 *              type: number
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=RECHARGE_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_RECHARGE_PAYPAL_FAIL
 *           <br> - ERROR_AMOUNT_INVALID
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_PAYPAL_FAIL
 */
router.post("/paypal", auth(), validateBody(TransactionSchema.rechargePaypal), RechargeController.rechargePaypal)
/**
 * @swagger
 * /api/recharges/credit-card:
 *   post:
 *     summary: Recharges With Credit Card
 *     security:
 *       - bearerAuth: []
 *     tags: [Recharges With Credit Card]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: amount
 *         description: "amount, minimum: 1"
 *         in: body
 *         required: true
 *         schema:
 *              type: number
 *       - name: paymentMethodId
 *         description: "paymentMethodId after create payment settings api/users/payment-settings/credit-card"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=RECHARGE_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_CREDIT_CARD_CONFIG_NOT_CREATE
 *           <br> - ERROR_RECHARGE_STRIPE_FAIL
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PAYMENT_METHOD_ID_NOT_FOUND
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_STRIPE_FAIL
 */
router.post("/credit-card", auth(), validateBody(TransactionSchema.rechargeStripe), RechargeController.rechargeStripe)
/**
 * @swagger
 * /api/recharges/razorpay:
 *   post:
 *     summary: Recharges With Razorpay
 *     security:
 *       - bearerAuth: []
 *     tags: [Recharges With Razorpay]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: amount
 *         description: "amount, minimum: 1"
 *         in: body
 *         required: true
 *         schema:
 *              type: number
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=RECHARGE_SUCCESS
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_RAZORPAY_FAIL
 */
router.post("/razorpay", auth(), validateBody(TransactionSchema.rechargeRazorpay), RechargeController.rechargeRazorpay)
/**
 * @swagger
 * /api/recharges/razorpay-verify:
 *   post:
 *     summary: Razorpay Verify
 *     security:
 *       - bearerAuth: []
 *     tags: [Razorpay Verify]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: razorpayPaymentId
 *         description: "razorpayPaymentId"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *       - name: razorpayOrderId
 *         description: "razorpayOrderId"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *       - name: razorpaySignature
 *         description: "razorpaySignature"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=RECHARGE_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_RAZORPAY_PAYMENT_ID_INVALID
 *           <br> - ERROR_RAZORPAY_PAYMENT_FAIL
 *           <br> - ERROR_RAZORPAY_SIGNATURE_INVALID
 *       404:
 *         description: Not Found
 *           <br> - ERROR_RAZORPAY_PAYMENT_ID_NOT_FOUND
 *       500:
 *         description: Internal Server Error
 */
router.post(
    "/razorpay-verify",
    auth(),
    validateBody(TransactionSchema.rechargeRazorpayVerify),
    RechargeController.rechargeRazorpayVerify
)
/**
 * @swagger
 * /api/recharges/google-pay:
 *   post:
 *     summary: Recharges With Google Pay
 *     security:
 *       - bearerAuth: []
 *     tags: [Recharges With Google Pay]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: amount
 *         description: "amount, minimum: 1"
 *         in: body
 *         required: true
 *         schema:
 *              type: number
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {clientSecret}
 *           <br> - message=CREATE_PAYMENT_INTENTS_STRIPE_SUCCESS
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_INTENTS_STRIPE_FAIL
 */
router.post(
    "/google-pay",
    auth(),
    validateBody(TransactionSchema.rechargeGooglePay),
    RechargeController.rechargeGooglePay
)
/**
 * @swagger
 * /api/recharges/google-pay-verify:
 *   post:
 *     summary: Google Pay Verify
 *     security:
 *       - bearerAuth: []
 *     tags: [Google Pay Verify]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: paymentIntentId
 *         description: "paymentIntentId"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=RECHARGE_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_PAYMENT_GOOGLE_PAY_FAIL
 *           <br> - ERROR_PAYMENT_INTENT_ID_INVALID
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_RETRIEVE_PAYMENT_INTENTS_STRIPE_FAIL
 */
router.post(
    "/google-pay-verify",
    auth(),
    validateBody(TransactionSchema.rechargeGooglePayVerify),
    RechargeController.rechargeGooglePayVerify
)
export default router
