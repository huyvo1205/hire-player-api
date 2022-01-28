import express from "express"
import RechargeController from "../controllers/RechargeController"
import { validateBody } from "../validators"
import TransactionSchema from "../schemas/TransactionSchema"
import auth from "../middlewares/auth"
import "express-async-errors"

const router = express.Router()
router.post("/paypal", auth(), validateBody(TransactionSchema.rechargePaypal), RechargeController.rechargePaypal)
router.post("/credit-card", auth(), validateBody(TransactionSchema.rechargeStripe), RechargeController.rechargeStripe)
router.post("/razorpay", auth(), validateBody(TransactionSchema.rechargeRazorpay), RechargeController.rechargeRazorpay)
router.get("/success", RechargeController.rechargeSuccess)
router.get("/cancel", RechargeController.rechargeCancel)
export default router
