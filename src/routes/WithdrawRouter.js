import express from "express"
import WithdrawController from "../controllers/WithdrawController"
import { validateBody } from "../validators"
import WithdrawSchema from "../schemas/WithdrawSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Withdraw:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         amount:
 *           type: number
 *         user:
 *           type: string
 *         key:
 *           type: string
 *         email:
 *           type: string
 *         note:
 *           type: string
 *         method:
 *           type: string
 *           description: "1. PAYPAL
 *                       <br> 2. Will be update...
 *                      "
 *         status:
 *           type: string
 *           description: "- DENIED
 *                       <br>- PENDING
 *                       <br>- PROCESSING
 *                       <br>- SUCCESS
 *                       <br>- CANCELED
 *                       <br>- FAILED
 *                      "
 *         timeWithdraw:
 *           type: string
 *           format: "date-time"
 *         createdAt:
 *           type: string
 *           format: "date-time"
 *         updatedAt:
 *           type: string
 *           format: "date-time"
 */
const router = express.Router()
/**
 * @swagger
 * /api/withdraws:
 *   get:
 *     summary: Get Withdraws
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Withdraws]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sortBy
 *         description: "Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: limit
 *         description: "Maximum number of results per page (default = 10)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: page
 *         description: "Current page (default = 1)"
 *         in: query
 *         schema:
 *              type: string
 *       - name: populate
 *         description: "Populate data fields. Only support 1 level and custom take fields
 *                       <br> EXAMPLE_1: populate=user:firstName,lastName
 *                       <br> -> populate user and only take 2 fields firstName, lastName
 *                       <br> EXAMPLE_2: populate=user:-firstName,-lastName
 *                       <br> -> populate user and take all fields except firstName, lastName
 *                       <br> EXAMPLE_3: populate=user
 *                       <br> -> populate user and take all fields
 *                      "
 *         in: query
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {results[], page, limit, totalPages, totalResults}
 *           <br> - message=GET_WITHDRAWS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Withdraw'
 */
router.get("/", auth(), WithdrawController.getWithdraws)
/**
 * @swagger
 * /api/withdraws/paypal:
 *   post:
 *     summary: Withdraw With Paypal
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
 *           <br> - message=WITHDRAW_PAYPAL_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_USER_NOT_ENOUGH_MONEY
 *           <br> - ERROR_EMAIL_INVALID
 *           <br> - ERROR_WITHDRAW_PAYPAL_FAIL
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYOUT_PAYPAL_FAIL
 *           <br> - ERROR_GET_PAYOUT_PAYPAL_FAIL
 *           <br> - ERROR_GET_PAYOUT_ITEM_PAYPAL_FAIL
 */
router.post("/paypal", auth(), validateBody(WithdrawSchema.payoutPaypal), WithdrawController.withdrawWithPaypal)
/**
 * @swagger
 * /api/withdraws/fees:
 *   get:
 *     summary: Get System Withdraw Fees
 *     security:
 *       - bearerAuth: []
 *     tags: [Get System Withdraw Fees]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "The response has fields
 *           <br> - data{ paypal: (number fee of Paypal)}
 *           <br> - message=GET_WITHDRAW_FEES_SUCCESS"
 */
router.get("/fees", auth(), WithdrawController.getWithdrawFees)
export default router
