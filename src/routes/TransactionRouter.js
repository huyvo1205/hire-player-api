import express from "express"
import TransactionController from "../controllers/TransactionController"
import { validateBody } from "../validators"
import TransactionSchema from "../schemas/TransactionSchema"
import "express-async-errors"

const router = express.Router()
router.post("/recharge", validateBody(TransactionSchema.recharge), TransactionController.recharge)
router.get("/recharge/success", TransactionController.rechargeSuccess)
router.get("/recharge/cancel", TransactionController.rechargeCancel)
export default router
