import express from "express";
import AuthController from "../controllers/AuthController";
import { validateBody } from "../validators";
import { AuthSchema } from "../schemas";
import "express-async-errors";
import auth from "../middlewares/auth";

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
 *         deletedBy:
 *           type: string
 *         roles:
 *           type: array
 *         email:
 *           type: string
 */

const router = express.Router();
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
 *         description: The user was successfully login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.post("/login", validateBody(AuthSchema.login), AuthController.login);
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
 *       - name: password
 *         description: User's password
 *         in: body
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The user was successfully register
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 */
router.post(
  "/register",
  validateBody(AuthSchema.register),
  AuthController.register
);

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
 *         description: The user was successfully logout
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

router.post("/logout", AuthController.logout);

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
 *         description: The user was successfully get profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/get-profile", auth(), AuthController.getProfile);

export default router;
