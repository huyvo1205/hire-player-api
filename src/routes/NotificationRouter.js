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
 *           type: object
 *           properties:
 *              avatar:
 *                type: object
 *                description: "Object avatar image"
 *              userName:
 *                type: string
 *                description: "userName"
 *              id:
 *                type: string
 *                description: "customer Id"
 *         player:
 *           type: object
 *           properties:
 *              playerInfo:
 *                type: object
 *                description: "Object playerInfo has fields playerName, rank, playerAvatar"
 *              id:
 *                type: string
 *                description: "player Id"
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
 *                       <br> REVIEW: 8 -> When customer review hire
 *                       <br> ADMIN_JOIN_CHAT: 9 -> When admin join chat
 *                       <br> DONATE: 10 -> User donate
 *                       <br> REPLY_DONATE: 11 -> User reply donate
 *                       <br> ADMIN_CANCEL_HIRE: 12 -> Admin cancel hire
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
 *                       <br> action ===  REVIEW: 8 -> hires/:id
 *                       <br> action ===  ADMIN_JOIN_CHAT: 9 -> hires/:id
 *                       <br> action ===  DONATE: 10 -> donates/:id
 *                       <br> action ===  REPLY_DONATE: 11 -> donates/:id
 *                       <br> action ===  ADMIN_CANCEL_HIRE: 12 -> hires/:id
 *                       <br> Data will be added later...
 *                      "
 *         payload:
 *           type: object
 *           description: "Object data type Mixed default has hireId, conversationId
 *                       <br> action ===  REQUEST_HIRE: 1 -> {hireId, conversationId}
 *                       <br> action ===  PLAYER_ACCEPT_HIRE: 2 -> {hireId, conversationId}
 *                       <br> action ===  PLAYER_CANCEL_HIRE: 3 -> {hireId, conversationId}
 *                       <br> action ===  CUSTOMER_CANCEL_HIRE: 4 -> {hireId, conversationId}
 *                       <br> action ===  CUSTOMER_FINISH_SOON: 5 -> {hireId, conversationId}
 *                       <br> action ===  CUSTOMER_REQUEST_COMPLAIN: 6 -> {hireId, conversationId}
 *                       <br> action ===  COMPLETE: 7 ->  {hireId, conversationId}
 *                       <br> action ===  REVIEW: 8 -> {hireId, conversationId, starPoint, reviewId}
 *                       <br> action ===  ADMIN_JOIN_CHAT: 9 -> {hireId, conversationId}
 *                       <br> action ===  DONATE: 10 -> { donateAmount, donateRealAmount, donateMessage, donateId }
 *                       <br> action ===  REPLY_DONATE: 11 -> { donateReplyMessage, donateId }
 *                       <br> action ===  ADMIN_CANCEL_HIRE: 12 ->  {hireId, conversationId, cost}
 *                       <br> Data will be added later...
 *                      "
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
 *       - name: latestId
 *         description: "Latest notification Id"
 *         in: query
 *         schema:
 *              type: string
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
 * /api/notifications/count-unread:
 *   get:
 *     summary: Count Unread Notifications of User Login
 *     security:
 *       - bearerAuth: []
 *     tags: [Count Unread Notifications]
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> data{count}
 *           <br> - message=COUNT_UNREAD_NOTIFICATIONS_SUCCESS
 */
router.get("/count-unread/", auth(), NotificationController.countUnreadNotifications)
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
 *           <br> - ERROR_NOTIFICATION_NOT_FOUND
 */
router.get("/:id", auth(), NotificationController.getDetailNotification)
/**
 * @swagger
 * /api/notifications/:id/read:
 *   put:
 *     summary: Read Notification
 *     security:
 *       - bearerAuth: []
 *     tags: [Read Notification]
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
 *           <br> - message=READ_NOTIFICATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_NOTIFICATION_NOT_FOUND
 */
router.put("/:id/read", auth(), NotificationController.readNotification)
/**
 * @swagger
 * /api/notifications/readers:
 *   post:
 *     summary: Readers All Notifications of User Login
 *     security:
 *       - bearerAuth: []
 *     tags: [Readers All Notifications]
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=READERS_NOTIFICATIONS_SUCCESS
 */
router.post("/readers", auth(), NotificationController.readersAllNotifications)
export default router
