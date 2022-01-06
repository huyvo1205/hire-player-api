import express from "express"
import auth from "../middlewares/auth"
import NotificationController from "../controllers/NotificationController"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customer:
 *           type: string
 *           description: "User Id"
 *         player:
 *           type: string
 *           description: "User Id"
 *         image:
 *           type: object
 *           description: "Image to display"
 *         isRead:
 *           type: boolean
 *           description: "User is read notify"
 *         action:
 *           type: integer
 *           description: "REQUEST_HIRE: 1 -> When customer request hire
 *                       <br> PLAYER_ACCEPT_HIRE: 2 -> When player accept hire
 *                       <br> PLAYER_CANCEL_HIRE: 3 -> When player cancel hire
 *                       <br> CUSTOMER_CANCEL_HIRE: 4 -> When customer cancel hire
 *                       <br> CUSTOMER_FINISH_SOON: 5 -> When customer finish soon
 *                       <br> CUSTOMER_REQUEST_COMPLAIN: 6 -> When customer request complain
 *                       <br> COMPLETE: 7 -> When player complete
 *                       <br> Data will be added later...
 *                      "
 *           enum:
 *           - 1
 *           - 2
 *           - 3
 *           - 4
 *           - 5
 *         href:
 *           type: string
 *           description: "action === REQUEST_HIRE: 1 -> hires/:id
 *                       <br> action ===  PLAYER_ACCEPT_HIRE: 2 -> hires/:id
 *                       <br> action ===  PLAYER_CANCEL_HIRE: 3 -> hires/:id
 *                       <br> action ===  CUSTOMER_CANCEL_HIRE: 4 -> hires/:id
 *                       <br> action ===  CUSTOMER_FINISH_SOON: 5 -> hires/:id
 *                       <br> action ===  CUSTOMER_REQUEST_COMPLAIN: 6 -> hires/:id
 *                       <br> action ===  COMPLETE: 7 -> hires/:id
 *                       <br> Data will be added later...
 *                      "
 *         payload:
 *           type: object
 *           properties:
 *              conversation:
 *                type: string
 *                description: "conversation Id"
 *              hire:
 *                type: string
 *                description: "hire Id"
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
 * /api/notifications:
 *   get:
 *     summary: Get Notifications
 *     tags: [Get Notifications]
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
 *           <br> - message=GET_NOTIFICATIONS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
router.get("/", auth(), NotificationController.getNotifications)
/**
 * @swagger
 * /api/notifications/:id:
 *   get:
 *     summary: Get Detail Notifications
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Detail Notifications]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Notification Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Notification}
 *           <br> - message=GET_DETAIL_NOTIFICATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 */
router.get("/:id", auth(), NotificationController.getDetailNotification)
export default router
