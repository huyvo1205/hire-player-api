import express from "express"
import auth from "../middlewares/auth"
import AdminController from "../controllers/AdminController"
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
 */
router.post("/join-chat", AdminController.joinChat)
router.post("/leave-chat", AdminController.leaveChat)

export default router
