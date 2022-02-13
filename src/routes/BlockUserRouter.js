import express from "express"
import auth from "../middlewares/auth"
import { validateBody } from "../validators"
import BlockUserController from "../controllers/BlockUserController"
import BlockUserSchema from "../schemas/BlockUserSchema"

import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     BlockUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         reason:
 *           type: string
 *         userBlocked:
 *           type: string
 *         blocker:
 *           type: string
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
 * /api/block-users:
 *   get:
 *     summary: Get Block Users
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Block Users]
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
 *           <br> - message=GET_BLOCK_USERS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockUser'
 */
router.get("/", auth(), BlockUserController.getBlockUsers)
/**
 * @swagger
 * /api/block-users/:id:
 *   get:
 *     summary: Get Detail Block User
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Detail Block User]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Block User Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {BlockUser}
 *           <br> - message=GET_DETAIL_BLOCK_USER_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockUser'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_BLOCK_USER_NOT_FOUND
 */
router.get("/:id", auth(), BlockUserController.getDetailBlockUser)
/**
 * @swagger
 * /api/block-users/:id:
 *   delete:
 *     summary: Delete Block User
 *     security:
 *       - bearerAuth: []
 *     tags: [Delete Block User]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Block User Id"
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 *           <br> - ERROR_BLOCK_USER_NOT_FOUND
 */
router.delete("/:id", auth(), BlockUserController.deleteBlockUser)
/**
 * @swagger
 * /api/block-users:
 *   post:
 *     summary: Create Block User
 *     security:
 *       - bearerAuth: []
 *     tags: [Create Block User]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: "userId"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *       - name: reason
 *         description: "reason"
 *         in: body
 *         schema:
 *              type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data{BlockUser}
 *           <br> - message=CREATE_BLOCK_USER_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockUser'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_USER_ALREADY_BLOCK_THIS_USER
 *       404:
 *         description: Not Found
 *           <br> - ERROR_USER_NOT_FOUND
 */
router.post("/", auth(), validateBody(BlockUserSchema.blockUser), BlockUserController.blockUser)
export default router
