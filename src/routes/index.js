import express from "express"
import UserRouter from "./UserRouter"
import AuthRouter from "./AuthRouter"
import TransactionRouter from "./TransactionRouter"
import PlayerRouter from "./PlayerRouter"
import ReviewRouter from "./ReviewRouter"

const router = express.Router()

router.use("/users", UserRouter)
router.use("/players", PlayerRouter)
router.use("/auth", AuthRouter)
router.use("/transactions", TransactionRouter)
router.use("/reviews", ReviewRouter)
export default router
