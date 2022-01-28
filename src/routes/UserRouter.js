import express from "express"
import auth from "../middlewares/auth"
import { validateBody } from "../validators"
import { createPaymentSettings, updatePaymentSettings, updatePaymentSettingsCreditCard } from "../schemas/PaymentSchema"
import UserController from "../controllers/UserController"
import UsersSchema from "../schemas/UsersSchema"

import "express-async-errors"

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentSetting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *           description: "userId"
 *         status:
 *           type: integer
 *           description: "ACTIVE: 1, INACTIVE: 2"
 *           enum:
 *           - 1
 *           - 2
 *         methods:
 *           type: array
 *           items:
 *              type: object
 *              properties:
 *                  type:
 *                      type: integer
 *                      description: "PAYPAL: 1, BANK: 2"
 *                      enum:
 *                      - 1
 *                      - 2
 *                  cardId:
 *                      type: string
 *                  email:
 *                      type: string
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
 * /api/users/payment-settings:
 *   get:
 *     summary: Get Payment Settings
 *     tags: [Get Payment Settings]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: "User Id"
 *         in: query
 *         type: string
 *       - name: status
 *         description: "Status Payment Setting: ACTIVE: 1, INACTIVE: 2"
 *         in: query
 *         type: integer
 *       - name: sortBy
 *         description: "Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)"
 *         in: query
 *         type: string
 *       - name: limit
 *         description: "Maximum number of results per page (default = 10)"
 *         in: query
 *         type: string
 *       - name: page
 *         description: "Current page (default = 1)"
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {results[], page, limit, totalPages, totalResults}
 *           <br> - message=GET_PAYMENT_SETTING_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSetting'
 */
router.get("/payment-settings", auth(), UserController.getPaymentSettings)
/**
 * @swagger
 * /api/users/payment-settings:
 *   post:
 *     summary: Create Payment Setting
 *     tags: [Create Payment Setting]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: methods
 *         description: "Array methods, field type in array is enum number -> PAYPAL: 1, BANK: 2"
 *         in: body
 *         type: array
 *         items:
 *            type: object
 *            properties:
 *               type:
 *                   type: integer
 *                   description: "PAYPAL: 1, BANK: 2"
 *                   enum:
 *                   - 1
 *                   - 2
 *               cardId:
 *                   type: string
 *               email:
 *                   type: string
 *         required: true
 *       - name: userId
 *         description: User Id
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data {PaymentSetting}
 *           <br> - message=CREATE_PAYMENT_SETTING_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSetting'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_USER_ALREADY_CREATE_PAYMENT_SETTING
 *       404:
 *         description: Not Found
 *           <br> - ERROR_USER_NOT_FOUND
 */
router.post("/payment-settings", auth(), validateBody(createPaymentSettings), UserController.createPaymentSettings)
/**
 * @swagger
 * /api/users/:id/payment-settings:
 *   put:
 *     summary: Update Payment Setting
 *     tags: [Update Payment Setting]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: methods
 *         description: "Array methods, field type in array is enum number -> PAYPAL: 1, BANK: 2"
 *         in: body
 *         type: array
 *         items:
 *            type: object
 *            properties:
 *               type:
 *                   type: integer
 *                   description: "PAYPAL: 1, BANK: 2"
 *                   enum:
 *                   - 1
 *                   - 2
 *               cardId:
 *                   type: string
 *               email:
 *                   type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {PaymentSetting}
 *           <br> - message=UPDATE_PAYMENT_SETTING_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSetting'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_USER_ALREADY_CREATE_PAYMENT_SETTING
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PAYMENT_SETTING_NOT_FOUND
 */
router.put("/:id/payment-settings", auth(), validateBody(updatePaymentSettings), UserController.updatePaymentSettings)
/**
 * @swagger
 * /api/users/:id:
 *   put:
 *     summary: Update User Info
 *     tags: [Update User Info]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: path
 *         schema:
 *              type: string
 *       - name: fullName
 *         description: "fullName
 *                      <br>- maxLength: 70
 *                      "
 *         in: body
 *       - name: gender
 *         description: "gender
 *                      <br>- enum: MALE: 1, FEMALE: 2
 *                      "
 *         schema:
 *              type: integer
 *         in: body
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data {User}
 *           <br> - message=UPDATE_USER_INFO_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *           <br> - ERROR_USER_NOT_FOUND
 */
router.put("/:id", auth(), validateBody(UsersSchema.updateUserInfo), UserController.updateUserInfo)
router.put(
    "/payment-settings/credit-card",
    auth(),
    validateBody(updatePaymentSettingsCreditCard),
    UserController.updatePaymentSettingsCreditCard
)
router.get("/:id/payment-settings", auth(), UserController.createPaymentSettings)
export default router
