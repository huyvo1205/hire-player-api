import express from "express"
import { createRootUser, createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/UsersController"
import auth from "../middlewares/auth"
import { ROLE_PERMISSIONS } from "../constants/UserConstant"
import { validateBody } from "../validators"
import { createPaymentSettings } from "../schemas/PaymentSchema"
import UserController from "../controllers/UserController"

const router = express.Router()
router.get("/", auth(ROLE_PERMISSIONS.MANAGE_USERS), getUsers)
router.post("/", auth(), createUser)
router.put("/:userId", auth(), updateUser)
router.delete("/:userId", auth(), deleteUser)
router.get("/:userId", auth(), getUser)
router.post("/root", createRootUser)
router.post("/payment-settings", auth(), validateBody(createPaymentSettings), UserController.createPaymentSettings)
export default router
