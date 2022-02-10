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
 *         paypalConfig:
 *           type: object
 *           properties:
 *             email:
 *              type: string
 *         creditCardConfig:
 *           type: object
 *           properties:
 *             paymentMethods:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      paymentMethodId:
 *                          type: string
 *                          description: "paymentMethodId"
 *                      type:
 *                          type: string
 *                          description: "type"
 *                      card:
 *                          type: object
 *                          properties:
 *                              number:
 *                                  type: string
 *                              expMonth:
 *                                  type: number
 *                              expYear:
 *                                  type: number
 *                              cvc:
 *                                  type: string
 *               description: "Array Object Payment Methods has fields [{ paymentMethodId, type, card: { number, expMonth, expYear, cvc } }]"
 *             customerId:
 *               type: string
 *               description: "customerId"
 *         createdAt:
 *           type: string
 *           format: "date-time"
 *         updatedAt:
 *           type: string
 *           format: "date-time"
 */

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update User Info
 *     security:
 *       - bearerAuth: []
 *     tags: [Update User Info]
 *     produces:
 *       - application/json
 *     parameters:
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
router.put("/", auth(), validateBody(UsersSchema.updateUserInfo), UserController.updateUserInfo)
/**
 * @swagger
 * /api/users/upload-avatar:
 *   put:
 *     summary: User Upload Avatar
 *     security:
 *       - bearerAuth: []
 *     tags: [User Upload Avatar]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: avatar
 *         description: "Key files upload is: avatar
 *                        <br>- only upload 1 avatar
 *                      "
 *         in: form
 *         schema:
 *              type: file
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=UPLOAD_AVATAR_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_KEY_UPLOAD_INVALID
 *           <br> - ERROR_MIMETYPE_INVALID
 *           <br> - ERROR_LIMIT_FILE_SIZE
 *           <br> - ERROR_LIMIT_UNEXPECTED_FILE
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PLAYER_NOT_FOUND
 *           <br> - ERROR_FILE_NOT_FOUND
 *       500:
 *         description: Internal Server
 */
router.put("/upload-avatar", auth(), UserController.uploadAvatarUserInfo)
/**
 * @swagger
 * /api/users/payment-settings/credit-card:
 *   put:
 *     summary: Update/Create Payment Setting Credit Card
 *     tags: [Update/Create Payment Setting Credit Card]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: number
 *         description: "Number card"
 *         in: body
 *         type: number
 *         required: true
 *       - name: expMonth
 *         description: "expMonth"
 *         in: body
 *         type: number
 *         required: true
 *       - name: expYear
 *         description: "expYear"
 *         in: body
 *         type: number
 *         required: true
 *       - name: cvc
 *         description: "cvc"
 *         in: body
 *         type: number
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
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL
 *           <br> - ERROR_CREATE_PAYMENT_METHOD_STRIPE_FAIL
 *           <br> - ERROR_UPDATE_PAYMENT_METHOD_STRIPE_FAIL
 */
router.put(
    "/payment-settings/credit-card",
    auth(),
    validateBody(updatePaymentSettingsCreditCard),
    UserController.updatePaymentSettingsCreditCard
)
/**
 * @swagger
 * /api/users/payment-settings:
 *   get:
 *     summary: Get Detail Payment Setting
 *     security:
 *       - bearerAuth: []
 *     tags: [Get Detail Payment Setting]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{PaymentSetting}
 *           <br> - message=GET_DETAIL_PAYMENT_SETTING_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSetting'
 */
router.get("/payment-settings", auth(), UserController.getPaymentSetting)
export default router
