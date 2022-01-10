import express from "express"
import DonateController from "../controllers/DonateController"
import { validateBody } from "../validators"
import DonateSchema from "../schemas/DonateSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Donate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "Unique Id"
 *         fromUser:
 *           type: string
 *           description: "User Id"
 *         toUser:
 *           type: string
 *           description: "User Id"
 *         message:
 *           type: string
 *         amount:
 *           type: number
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
 * /api/donates:
 *   post:
 *     summary: Create Donate
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Donate]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: amount
 *         description: "amount"
 *         in: body
 *         required: true
 *         schema:
 *              type: number
 *       - name: message
 *         description: "message"
 *         in: body
 *         schema:
 *              type: string
 *       - name: toUser
 *         description: "toUser id"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - message=CREATE_DONATE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donate'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_USER_NOT_ENOUGH_MONEY
 *       404:
 *         description: Not Found
 *           <br> - ERROR_TO_USER_NOT_FOUND
 */
router.post("/", auth(), validateBody(DonateSchema.createDonate), DonateController.createDonate)
export default router
