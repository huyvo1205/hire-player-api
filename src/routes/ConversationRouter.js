import express from "express"
import ConversationController from "../controllers/ConversationController"
import { validateBody } from "../validators"
import ConversationSchema from "../schemas/ConversationSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         members:
 *           type: array
 *           description: "User Ids, uniqueItems: true, minItems: 2"
 *           items:
 *              type: string
 *              description: "Player Id"
 *         latestMessage:
 *           type: object
 *           description: "Message Object"
 *         customer:
 *           type: string
 *           description: "User Id"
 *         player:
 *           type: string
 *           description: "User Id"
 *         status:
 *           type: integer
 *           description: "ACTIVE: 1, INACTIVE: 2"
 *           default: 1
 *           enum:
 *           - 1
 *           - 2
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         content:
 *           type: string
 *           description: "Content notify"
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
 *                       <br> ACCEPT_HIRE: 2 -> When player accept hire
 *                       <br> PLAYER_CANCEL_HIRE: 3 -> When player cancel hire
 *                       <br> CUSTOMER_CANCEL_HIRE: 4 -> When customer cancel hire
 *                       <br> REQUEST_COMPLAIN: 5 -> When customer|player request complain
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
 *                       <br> action ===  ACCEPT_HIRE: 2 -> hires/:id
 *                       <br> action ===  PLAYER_CANCEL_HIRE: 3 -> hires/:id
 *                       <br> action ===  CUSTOMER_CANCEL_HIRE: 4 -> hires/:id
 *                       <br> action ===  REQUEST_COMPLAIN: 5 -> conversation/:id
 *                       <br> Data will be added later...
 *                      "
 *         payload:
 *           type: object
 *           properties:
 *              conversationId:
 *                type: string
 *                description: "conversationId"
 *              hireId:
 *                type: string
 *                description: "hireId"
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
 * /api/conversations:
 *   get:
 *     summary: Get Conversations
 *     tags: [Get Conversations]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: playerId
 *         description: "User Id"
 *       - name: customerId
 *         description: "User Id"
 *         in: query
 *         schema:
 *              type: string
 *       - name: status
 *         description: "Status Conversation: ACTIVE: 1, INACTIVE: 2"
 *         in: query
 *         schema:
 *              type: integer
 *       - name: searchText
 *         description: "Search Text: search playerName"
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
 *           <br> - message=GET_CONVERSATIONS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 */
router.get("/", ConversationController.getConversations)
/**
 * @swagger
 * /api/conversations/:id:
 *   get:
 *     summary: Get Detail Conversation
 *     tags: [Get Detail Conversation]
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
 *           <br> - data{Conversation}
 *           <br> - message=GET_DETAIL_CONVERSATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 */
router.get("/:id", ConversationController.getDetailConversation)
/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create Conversation
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Conversation]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: members
 *         description: "Array Player Ids"
 *         in: body
 *         schema:
 *           type: array
 *           description: "Player Ids, uniqueItems: true, minItems: 2"
 *           items:
 *              type: string
 *              description: "Player Id"
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{ conversation:Conversation, status, body, type, sender:{User}, latestMessage:{Message} }
 *           <br> - message=CREATE_CONVERSATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_MEMBERS_NOT_FOUND
 */
router.post("/", validateBody(ConversationSchema.createConversation), ConversationController.createConversation)
/**
 * @swagger
 * /api/conversation/:id:
 *   put:
 *     summary: Update Conversation
 *     security:
 *       - bearerAuth: []
 *     tags: [Update Conversation]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: members
 *         description: "Array Player Ids"
 *         in: body
 *         schema:
 *           type: array
 *           description: "Player Ids, uniqueItems: true, minItems: 2"
 *           items:
 *              type: string
 *              description: "Player Id"
 *         required: true
 *       - name: id
 *         description: "Conversation Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: latestMessage
 *         description: "Latest Message"
 *         in: body
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{Conversation}
 *           <br> - message=UPDATE_CONVERSATION_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_MEMBERS_NOT_FOUND
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 */
router.put("/:id", validateBody(ConversationSchema.updateConversation), ConversationController.updateConversation)
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
router.delete("/:id", auth(), ConversationController.deleteConversation)
/**
 * @swagger
 * /api/conversations/:id/message:
 *   get:
 *     summary: Get Messages In Conversation
 *     tags: [Get Messages In Conversation]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Conversation Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: senderId
 *         description: "Sender Id"
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
 *           <br> - message=GET_CONVERSATIONS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.get("/:id/message", auth(), ConversationController.getConversationMessages)
/**
 * @swagger
 * /api/conversations/:id/message:
 *   post:
 *     summary: Create Message In Conversation
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Message In Conversation]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: "Object body"
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *              content:
 *                  type: string
 *                  description: "Text message"
 *              attachments:
 *                  type: array
 *                  description: "Array media"
 *         required: true
 *       - name: senderId
 *         description: "User Id"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *       - name: type
 *         description: "Type message"
 *         in: body
 *         schema:
 *              type: number
 *              description: "TEXT: 1, MEDIA: 2"
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{ conversation:{Conversation}, status, body, type, sender:{User}, latestMessage:{Message} }
 *           <br> - message=CREATE_MESSAGE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_BODY_INVALID
 *           <br> - ERROR_SENDER_NOT_IN_CONVERSATION
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 *           <br> - ERROR_SENDER_NOT_FOUND
 */
router.post(
    "/:id/message",
    auth(),
    validateBody(ConversationSchema.createConversationMessage),
    ConversationController.createConversationMessage
)
/**
 * @swagger
 * /api/conversations/:id/complain:
 *   post:
 *     summary: Create Request Complain
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Request Complain]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: hireId
 *         description: "hireId"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{empty}
 *           <br> - message=CREATE_COMPLAIN_SUCCESS
 *       404:
 *         description: Not Found
 *           <br> - ERROR_USER_NOT_FOUND
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.post(
    "/:id/complain",
    auth(),
    validateBody(ConversationSchema.createComplain),
    ConversationController.handleComplainConversation
)
router.get("/:id/message/readers", auth(), ConversationController.readerMessages)
export default router
