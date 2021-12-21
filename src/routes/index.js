import express from "express"
import UserRouter from "./UserRouter"
import AuthRouter from "./AuthRouter"
import TransactionRouter from "./TransactionRouter"
import PlayerRouter from "./PlayerRouter"
import ReviewRouter from "./ReviewRouter"
import ConversationRouter from "./ConversationRouter"
import MessageRouter from "./MessageRouter"
import HireRouter from "./HireRouter"

const router = express.Router()

router.use("/users", UserRouter)
router.use("/players", PlayerRouter)
router.use("/auth", AuthRouter)
router.use("/transactions", TransactionRouter)
router.use("/reviews", ReviewRouter)
router.use("/conversations", ConversationRouter)
router.use("/messages", MessageRouter)
router.use("/hires", HireRouter)
export default router
