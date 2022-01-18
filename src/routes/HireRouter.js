import express from "express"
import HireController from "../controllers/HireController"
import { validateBody } from "../validators"
import HireSchema from "../schemas/HireSchema"
import ReviewSchema from "../schemas/ReviewSchema"
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
 *           description: "WAITING: 1, ACCEPT: 2, PLAYER_CANCEL: 3, CUSTOMER_CANCEL: 4, COMPLETE: 5, COMPLAIN: 6, default: 1"
 *         acceptedAt:
 *           type: string
 *           format: "date-time"
 *         canceledAt:
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
 *         realCost:
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
 *       - name: customerNote
 *         description: "Customer's Note"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{hire, conversation}
 *           <br> - message=CREATE_CONVERSATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_PLAYER_ID_INVALID
 *           <br> - ERROR_CUSTOMER_ID_INVALID
 *           <br> - ERROR_USER_NOT_PLAYER
 *           <br> - ERROR_PLAYER_NOT_RECEIVE_HIRE
 *           <br> - ERROR_PLAYER_BUSY
 *           <br> - ERROR_TIME_RENT_TOO_LONG
 *           <br> - ERROR_YOU_HAVE_HIRED_THIS_PLAYER_WAIT_FOR_THE_PLAYER_TO_ACCEPT_IT
 *           <br> - ERROR_CUSTOMER_NOT_ENOUGH_MONEY
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
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *           <br> - ERROR_ONLY_PLAYER_ACCEPT_HIRE
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/accept", auth(), HireController.acceptHire)
/**
 * @swagger
 * /api/hires/:id/player-cancel:
 *   put:
 *     summary: Player Cancel Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Player Cancel Hire]
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
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *           <br> - ERROR_ONLY_PLAYER_CANCEL_HIRE
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/player-cancel", auth(), validateBody(HireSchema.cancelHire), HireController.playerCancelHire)
/**
 * @swagger
 * /api/hires/:id/customer-cancel:
 *   put:
 *     summary: Customer Cancel Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Customer Cancel Hire]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=CANCEL_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *           <br> - ERROR_ONLY_CUSTOMER_CANCEL_HIRE
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/customer-cancel", auth(), HireController.customerCancelHire)

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
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *           <br> - ERROR_ONLY_CUSTOMER_FINISH_SOON
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/finish-soon", auth(), HireController.finishSoonHire)
/**
 * @swagger
 * /api/hires/:id/complain:
 *   put:
 *     summary: Customer Request complain
 *     security:
 *       - bearerAuth: []
 *     tags: [Customer Request complain]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=REQUEST_COMPLAIN_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_ONLY_CUSTOMER_REQUEST_COMPLAIN
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/complain", auth(), HireController.requestComplain)

/**
 * @swagger
 * /api/hires/:id/complete:
 *   put:
 *     summary: Player Complete Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Player Complete Hire]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Hire}
 *           <br> - message=COMPLETE_HIRE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hire'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_ONLY_PLAYER_COMPLETE_HIRE
 *           <br> - ERROR_PLAYER_NOT_COMPLETE_HIRE
 *           <br> - ERROR_STATUS_HIRE_INVALID
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.put("/:id/complete", auth(), HireController.completeHire)

/**
 * @swagger
 * /api/hires/:id/reviews:
 *   put:
 *     summary: Create Review For Hire
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Review For Hire]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: starPoint
 *         description: "Star Point integer number"
 *         in: body
 *         schema:
 *              type: integer
 *         required: true
 *       - name: content
 *         description: "Content"
 *         in: body
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Review}
 *           <br> - message=CREATE_REVIEW_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_ONLY_CUSTOMER_CREATE_REVIEW
 *           <br> - ERROR_CUSTOMER_ALREADY_REVIEW_THIS_HIRE
 *           <br> - ERROR_HIRE_NOT_COMPLETE
 *       404:
 *         description: Not Found
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.post("/:id/reviews", auth(), validateBody(ReviewSchema.createReview), HireController.reviewHire)
export default router
