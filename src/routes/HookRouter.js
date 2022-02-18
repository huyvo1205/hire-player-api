import express from "express"
import WithdrawController from "../controllers/WithdrawController"
import { validateBody } from "../validators"
import WithdrawSchema from "../schemas/WithdrawSchema"
import auth from "../middlewares/auth"
import "express-async-errors"

const router = express.Router()
/**
 * @swagger
 * /api/hooks/paypal:
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
 *           <br> - message=RECHARGE_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_RECHARGE_PAYPAL_FAIL
 *           <br> - ERROR_AMOUNT_INVALID
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_PAYPAL_FAIL
 */
router.post("/paypal", WithdrawController.hookPaypal)
export default router
