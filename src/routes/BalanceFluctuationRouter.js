import express from "express"
import BalanceFluctuationController from "../controllers/BalanceFluctuationController"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     BalanceFluctuation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         amount:
 *           type: number
 *         user:
 *           type: string
 *         action:
 *           type: string
 *           description: "1. RECEIVE_MONEY_DONATE
 *                       <br> 2. DONATE
 *                       <br> 3. RENT_PLAYER
 *                       <br> 4. RECEIVE_MONEY_HIRE
 *                       <br> 5. CANCEL_HIRE
 *                       <br> 6. RECHARGE
 *                      "
 *         operation:
 *           type: string
 *           description: "PLUS: +
 *                       <br> SUBTRACT: -"
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
 * /api/balance-fluctuations:
 *   get:
 *     summary: Get Balance Fluctuations
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Balance Fluctuations]
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
 *           <br> - message=GET_BALANCE_FLUCTUATIONS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceFluctuation'
 */
router.get("/", auth(), BalanceFluctuationController.getBalanceFluctuations)
export default router
