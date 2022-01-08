import express from "express"
import PlayerController from "../controllers/PlayerController"
import { validateBody } from "../validators"
import PlayerInfoSchema from "../schemas/PlayerSchema"
import auth from "../middlewares/auth"
import "express-async-errors"

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
router.put("/:id", auth(), PlayerController.updatePlayer)
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
router.post("/:id/upload-images", auth(), PlayerController.uploadImagesPlayerInfo)
/**
 * @swagger
 * /api/players/:id/update-info:
 *   put:
 *     summary: Player Update Info
 *     security:
 *       - bearerAuth: []
 *     tags: [Player Update Info]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Player Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: playerName
 *         description: "playerName"
 *         in: body
 *         schema:
 *              type: string
 *       - name: gameName
 *         description: "gameName"
 *         in: body
 *         schema:
 *              type: string
 *       - name: rank
 *         description: "rank"
 *         in: body
 *         schema:
 *              type: string
 *       - name: costPerHour
 *         description: "costPerHour"
 *         in: body
 *         schema:
 *              type: number
 *       - name: description
 *         description: "description"
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
router.put(
    "/:id/update-info",
    auth(),
    validateBody(PlayerInfoSchema.updatePlayerInfo),
    PlayerController.updatePlayerInfo
)
/**
 * @swagger
 * /api/players/:id/hire-settings:
 *   put:
 *     summary: Player Update Hire Settings
 *     security:
 *       - bearerAuth: []
 *     tags: [Player Update Hire Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Player Id"
 *         in: path
 *         schema:
 *              type: string
 *       - name: isReceiveHire
 *         description: "isReceiveHire true/false"
 *         in: body
 *         schema:
 *              type: boolean
 *       - name: timeMaxHire
 *         description: "timeMaxHire"
 *         in: body
 *         schema:
 *              type: number
 *       - name: timeReceiveHire
 *         description: "- Array integer number timeReceiveHire
 *                     <br> - minimum: 1
 *                     <br> - maximum: 24
 *                     <br> - uniqueItems
 *                     <br> - EXAMPLE: [1,2,3,4]
 *                      "
 *         in: body
 *         schema:
 *              type: array
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=UPDATE_HIRE_SETTINGS_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_NOT_FOUND
 */
router.put(
    "/:id/hire-settings",
    auth(),
    validateBody(PlayerInfoSchema.updateHireSettings),
    PlayerController.updateHireSettings
)
export default router
