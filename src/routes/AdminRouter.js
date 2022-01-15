import express from "express"
import auth from "../middlewares/auth"
import AdminController from "../controllers/AdminController"
import AdminSchema from "../schemas/AdminSchema"
import { validateBody } from "../validators"
import "express-async-errors"

const router = express.Router()
/* auth[ADMIN] => auth route for ADMIN */
router.use(auth("ADMIN"))
/**
 * @swagger
 * /api/admin/join-chat:
 *   get:
 *     summary: Admin Join Chat
 *     tags: [Admin Join Chat]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: conversationId
 *         description: "Conversation Id"
 *         in: body
 *         required: true
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
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_HIRE_NOT_COMPLAIN
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 *           <br> - ERROR_HIRE_NOT_FOUND
 */
router.post("/join-chat", validateBody(AdminSchema.joinChat), AdminController.joinChat)
/**
 * @swagger
 * /api/admin/leave-chat:
 *   get:
 *     summary: Admin Leave Chat
 *     tags: [Admin Leave Chat]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: conversationId
 *         description: "Conversation Id"
 *         in: body
 *         required: true
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
 *               $ref: '#/components/schemas/Conversation'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_CONVERSATION_NOT_FOUND
 */
router.post("/leave-chat", validateBody(AdminSchema.leaveChat), AdminController.leaveChat)

export default router
