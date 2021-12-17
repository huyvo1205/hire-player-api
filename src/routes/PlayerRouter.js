import express from "express"
import PlayerController from "../controllers/PlayerController"
import { validateBody } from "../validators"
import PlayerInfoSchema from "../schemas/PlayerSchema"
import auth from "../middlewares/auth"
import "express-async-errors"
/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         gameName:
 *           type: string
 *         playerName:
 *           type: string
 *         user:
 *           type: string
 *         rank:
 *           type: string
 *         description:
 *           type: string
 *         costPerHour:
 *           type: number
 *         totalTimeHired:
 *           type: number
 *         completionRate:
 *           type: number
 *         avgRating:
 *           type: number
 *         isReceiveHire:
 *           type: boolean
 *         playerVerified:
 *           type: boolean
 *         timeReceiveHire:
 *           type: array
 *         images:
 *           type: array
 *         statusHire:
 *           type: integer
 *           description: "READY: 1, BUSY: 2"
 *           enum:
 *           - 1
 *           - 2
 *         typePlayer:
 *           type: integer
 *           description: "VIP: 1, HOT: 2, NEW: 3"
 *           enum:
 *           - 1
 *           - 2
 *           - 3
 *         isOnline:
 *           type: boolean
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
const router = express.Router()
/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get Players
 *     tags: [Get Players]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: "User Id"
 *         in: query
 *         schema:
 *              type: string
 *       - name: status
 *         description: "Status Player: ACTIVE: 1, INACTIVE: 2"
 *         in: query
 *         schema:
 *              type: integer
 *       - name: typePlayer
 *         description: "Type Player: VIP: 1, HOT: 2, NEW: 3"
 *         in: query
 *         schema:
 *              type: integer
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
 *           <br> - message=GET_PAYMENT_SETTING_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/", PlayerController.getPlayersInfo)
/**
 * @swagger
 * /api/players/:id:
 *   put:
 *     summary: Update Player Info
 *     security:
 *       - bearerAuth: []
 *     tags: [Update Player Info]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Player Id
 *         in: path
 *         schema:
 *              type: string
 *       - name: gameName
 *         description: Player's gameName
 *         in: body
 *         schema:
 *              type: string
 *       - name: costPerHour
 *         description: Cost Per Hour
 *         in: body
 *         schema:
 *              type: number
 *       - name: description
 *         description: Player's description
 *         in: body
 *         schema:
 *              type: string
 *       - name: rank
 *         description: Player's rank
 *         in: body
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=UPDATE_PLAYER_INFO_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_NOT_FOUND
 */
router.put("/:id", auth(), validateBody(PlayerInfoSchema.updatePlayerInfo), PlayerController.updatePlayerInfo)
/**
 * @swagger
 * /api/players/:id:
 *   get:
 *     summary: Get Detail Player Info
 *     tags: [Get Detail Player Info]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Player Id
 *         in: path
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=GET_DETAIL_PLAYER_INFO_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_NOT_FOUND
 */
router.get("/:id", PlayerController.getDetailPlayerInfo)
/**
 * @swagger
 * /api/players/:id/upload-images:
 *   put:
 *     summary: Player Upload Images
 *     security:
 *       - bearerAuth: []
 *     tags: [Player Upload Images]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Player Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: images
 *         description: "Key files upload is: images"
 *         in: form
 *         schema:
 *              type: file
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=UPLOAD_IMAGES_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_KEY_UPLOAD_INVALID
 *           <br> - ERROR_MIMETYPE_INVALID
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_NOT_FOUND
 *       500:
 *         description: Internal Server
 */
router.post("/:id/upload-images", PlayerController.uploadImagesPlayerInfo)
export default router
