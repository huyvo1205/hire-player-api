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
 *         realAmount:
 *           type: number
 *         replyMessage:
 *           type: string
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
 *   get:
 *     summary: Get Donates
 *     tags: [Get Donates]
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
 *                       <br> EXAMPLE_4: populate=player:firstName|customer:firstName
 *                       <br> -> populate multi fields split by |
 *                      "
 *         in: query
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {results[], page, limit, totalPages, totalResults}
 *           <br> - message=GET_DONATES_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donate'
 */
router.get("/", auth(), DonateController.getDonates)
/**
 * @swagger
 * /api/donates/receive:
 *   get:
 *     summary: Get Receive Donates
 *     tags: [Get Receive Donates]
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
 *                       <br> EXAMPLE_4: populate=player:firstName|customer:firstName
 *                       <br> -> populate multi fields split by |
 *                      "
 *         in: query
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {results[], page, limit, totalPages, totalResults}
 *           <br> - message=GET_RECEIVE_DONATES_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donate'
 */
router.get("/receive/", auth(), DonateController.getReceiveDonates)
/**
 * @swagger
 * /api/donates/:id:
 *   get:
 *     summary: Get Detail Donate
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Detail Donate]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Donate Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Donate}
 *           <br> - message=GET_DETAIL_DONATE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donate'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_DONATE_NOT_FOUND
 */
router.get("/:id", auth(), DonateController.getDetailDonate)
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
 *         description: "message: maxLength: 255, minLength: 1"
 *         in: body
 *         required: true
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
/**
 * @swagger
 * /api/donates/:id/reply:
 *   post:
 *     summary: Reply Donate
 *     security:
 *       - bearerAuth: []
 *     tags: [Reply Donate]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: replyMessage
 *         description: "Reply Message: maxLength: 255, minLength: 1"
 *         in: body
 *         required: true
 *         schema:
 *              type: string
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - message=REPLY_DONATE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donate'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_ONLY_RECEIVER_REPLY_DONATE
 *           <br> - ERROR_THIS_DONATE_ALREADY_REPLY
 *       404:
 *         description: Not Found
 *           <br> - ERROR_DONATE_NOT_FOUND
 */
router.post("/:id/reply", auth(), validateBody(DonateSchema.replyDonate), DonateController.replyDonate)
export default router
