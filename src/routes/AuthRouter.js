import express from "express"
import AuthController from "../controllers/AuthController"
import { validateBody } from "../validators"
import { AuthSchema } from "../schemas"
import "express-async-errors"
import auth from "../middlewares/auth"

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         nickName:
 *           type: string
 *         gender:
 *           type: integer
 *           description: "MALE: 1, FEMALE: 2"
 *           enum:
 *           - 1
 *           - 2
 *         avatar:
 *           type: string
 *         playerInfo:
 *           type: string
 *         firstName:
 *           type: string
 *           required: true
 *         money:
 *           type: number
 *         lastName:
 *           type: string
 *           required: true
 *         googleId:
 *           type: string
 *         isOnline:
 *           type: boolean
 *           default: false
 *         status:
 *           type: integer
 *           description: "ACTIVE: 1, INACTIVE: 2, VERIFIED: 3"
 *           default: 1
 *           enum:
 *           - 1
 *           - 2
 *           - 3
 *         deletedAt:
 *           type: string
 *           format: "date-time"
 *         emailVerifiedAt:
 *           type: string
 *           format: "date-time"
 *         createdAt:
 *           type: string
 *           format: "date-time"
 *         updatedAt:
 *           type: string
 *           format: "date-time"
 *         deletedBy:
 *           type: string
 *         roles:
 *           type: array
 *         email:
 *           type: string
 */

const router = express.Router()
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Login]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: body
 *         type: string
 *         required: true
 *       - name: password
 *         description: User's password
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - userInfo
 *           <br> - accessToken
 *           <br> - refreshToken
 *           <br> - message=LOGIN_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_INCORRECT_EMAIL_OR_PASSWORD
 */
router.post("/login", validateBody(AuthSchema.login), AuthController.login)
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Register]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User's firstName
 *         in: body
 *         type: string
 *         required: true
 *       - name: lastName
 *         description: User's lastName
 *         in: body
 *         type: string
 *         required: true
 *       - name: email
 *         description: User's email
 *         in: body
 *         type: string
 *         required: true
 *       - name: hash
 *         description: Hash take from API:/v1/auth/send-otp
 *         in: body
 *         type: string
 *         required: true
 *       - name: otp
 *         description: Otp code get from Email
 *         in: body
 *         type: string
 *         required: true
 *       - name: password
 *         description: User's password
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - userInfo
 *           <br> - accessToken
 *           <br> - refreshToken
 *           <br> - message=REGISTER_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_PASSWORD_INVALID
 *           <br> - ERROR_EMAIL_ALREADY_EXISTS
 *
 */
router.post("/register", validateBody(AuthSchema.register), AuthController.register)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Logout]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: refreshToken
 *         description: refreshToken
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - userInfo
 *           <br> - message=LOGOUT_SUCCESS
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

router.post("/logout", AuthController.logout)

/**
 * @swagger
 * /api/auth/get-profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Profile
 *     tags: [GetProfile]
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - userInfo
 *           <br> - message=GET_PROFILE_SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *           <br> - ERROR_UNAUTHORIZED
 *       403:
 *         description: Forbidden
 *           <br> - ERROR_FORBIDDEN
 */
router.get("/get-profile", auth(), AuthController.getProfile)
/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send Otp to Email
 *     tags: [Send Otp]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - hash
 *           <br> - email
 *           <br> - message=SEND_OTP_SUCCESS
 *       500:
 *         description: Server Error
 */
router.post("/send-otp", validateBody(AuthSchema.sendOtp), AuthController.sendOtp)
/**
 * @swagger
 * /api/auth/request-reset-password:
 *   post:
 *     summary: Request Reset Password
 *     tags: [Request Reset Password]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - message=REQUEST_RESET_PASSWORD_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_EMAIL_DOES_NOT_EXIST
 *       500:
 *         description: Server Error
 */
router.post(
    "/request-reset-password",
    validateBody(AuthSchema.requestResetPassword),
    AuthController.requestResetPassword
)
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Reset Password]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId
 *         in: body
 *         type: string
 *         required: true
 *       - name: token
 *         description: token take from link send to Email from API /api/auth/request-reset-password
 *         in: body
 *         type: string
 *         required: true
 *       - name: password
 *         description: password
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The response has fields
 *           <br> - userInfo
 *           <br> - message=RESET_PASSWORD_SUCCESS
 *       400:
 *         description: Bad Request
 *           <br> - ERROR_INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN
 *           <br> - ERROR_PASSWORD_INVALID
 *       500:
 *         description: Server Error
 */
router.post("/reset-password", validateBody(AuthSchema.resetPassword), AuthController.resetPassword)
export default router
