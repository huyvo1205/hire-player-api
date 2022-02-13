import express from "express"
import auth from "../middlewares/auth"
import { validateBody } from "../validators"
import { updatePaymentSettingsCreditCard } from "../schemas/PaymentSchema"
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
 *                              brand:
 *                                  type: string
 *                              country:
 *                                  type: string
 *                              expMonth:
 *                                  type: number
 *                              expYear:
 *                                  type: number
 *                              fingerprint:
 *                                  type: string
 *                              funding:
 *                                  type: string
 *                              last4:
 *                                  type: string
 *               description: "Array Object Payment Methods has fields [{ paymentMethodId, type, card: { brand, country, expMonth, expYear, fingerprint, funding, last4 } }]"
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
 *       - name: paymentMethodId
 *         description: "Payment Method Id"
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: The response has fields
 *           <br> - data {PaymentSetting}
 *           <br> - message=CREATE_PAYMENT_SETTING_CREDIT_CARD_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSetting'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_THE_PAYMENT_METHOD_YOU_PROVIDED_HAS_ALREADY_BEEN_ATTACHED_TO_A_CUSTOMER
 *       404:
 *         description: Not Found
 *           <br> - ERROR_PAYMENT_METHOD_ID_NOT_FOUND
 *           <br> - ERROR_CREATE_PAYMENT_METHOD_STRIPE_FAIL
 *       500:
 *         description: Internal Server Error
 *           <br> - ERROR_CREATE_PAYMENT_CUSTOMER_STRIPE_FAIL
 *           <br> - ERROR_CREATE_PAYMENT_METHOD_STRIPE_FAIL
 *           <br> - ERROR_RETRIEVE_PAYMENT_METHOD_STRIPE_FAIL
 */
router.put(
    "/payment-settings/credit-card",
    auth(),
    validateBody(updatePaymentSettingsCreditCard),
    UserController.updatePaymentSettingsCreditCard
)
// router.get("/payment-settings/credit-card", auth(), UserController.getPaymentSettingsCreditCard)
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
/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change Password
 *     security:
 *       - bearerAuth: []
 *     tags: [Change Password]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: oldPassword
 *         description: "Old Password"
 *         in: body
 *         type: string
 *         required: true
 *       - name: newPassword
 *         description: "New Password"
 *         in: body
 *         type: string
 *         required: true
 *       - name: confirmPassword
 *         description: "Confirm Password"
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - data{User}
 *           <br> - message=CHANGE_PASSWORD_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_OLD_PASSWORD_INVALID
 *           <br> - ERROR_PASSWORD_NOT_MATCH
 *           <br> - ERROR_NEW_PASSWORD_INVALID
 */
router.post("/change-password", auth(), validateBody(UsersSchema.changePassword), UserController.changePassword)
export default router
