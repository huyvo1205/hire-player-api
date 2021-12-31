import express from "express"
import HireController from "../controllers/HireController"
import { validateBody } from "../validators"
import HireSchema from "../schemas/HireSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Hire:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "Unique Id"
 *         customer:
 *           type: string
 *           description: "User Id"
 *         player:
 *           type: string
 *           description: "User Id"
 *         cancelReason:
 *           type: string
 *         customerNote:
 *           type: string
 *         hireStep:
 *           type: number
 *           description: "WAITING: 1, ACCEPT: 2, PLAYER_CANCEL: 3, CUSTOMER_CANCEL: 4, default: 1"
 *         acceptedAt:
 *           type: string
 *           format: "date-time"
 *         isCompleteSoon:
 *           type: boolean
 *           description: "Default: false"
 *         rate:
 *           type: number
 *         timeRent:
 *           type: number
 *         cost:
 *           type: number
 *         conversation:
 *           type: string
 *           description: "Conversation Id"
 *         seenAt:
 *           type: string
 *           format: "date-time"
 *         deletedAt:
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
 * /api/hires/:id:
 *   get:
 *     summary: Get Detail Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Detail Hire]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Hire Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=GET_DETAIL_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.get("/:id", auth(), HireController.getDetailHire)
/**
 * @swagger
 * /api/hires:
 *   post:
 *     summary: Create Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Hire]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: playerId
 *         description: "User Id"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *       - name: timeRent
 *         description: "Time Rent"
 *         in: body
 *         schema:
 *              type: number
 *         required: true
 *       - name: cost
 *         description: "Cost"
 *         in: body
 *         schema:
 *              type: number
 *         required: true
 *       - name: customerNote
 *         description: "Customer's Note"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{Conversation}
 *           <br> - message=CREATE_CONVERSATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_ID_INVALID
 *           <br> - ERROR_CUSTOMER_ID_INVALID
 *           <br> - ERROR_USER_NOT_PLAYER
 *           <br> - ERROR_PLAYER_NOT_RECEIVE_HIRE
 *           <br> - ERROR_PLAYER_BUSY
 */
router.post("/", auth(), validateBody(HireSchema.createHire), HireController.createHire)
/**
 * @swagger
 * /api/hires/:id/accept:
 *   put:
 *     summary: Accept Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Accept Hire]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=ACCEPT_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/accept", auth(), HireController.acceptHire)
/**
 * @swagger
 * /api/hires/:id/cancel:
 *   put:
 *     summary: Cancel Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Cancel Hire]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cancelReason
 *         description: "Cancel Reason"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=CANCEL_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/cancel", auth(), validateBody(HireSchema.cancelHire), HireController.cancelHire)
/**
 * @swagger
 * /api/hires/:id/finish-soon:
 *   put:
 *     summary: Finish Soon Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Finish Soon Hire]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=FINISH_SOON_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/finish-soon", auth(), HireController.cancelHire)
/**
 * @swagger
 * /api/conversation/:id:
 *   delete:
 *     summary: Delete Conversation
 *     security:
 *       - bearerAuth: []
 *     tags: [Delete Conversation]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Conversation Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=DELETE_CONVERSATION_SUCCESS
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 */

export default router
