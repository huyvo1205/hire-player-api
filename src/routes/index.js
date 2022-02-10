import express from "express"
import UserRouter from "./UserRouter"
import AuthRouter from "./AuthRouter"
import RechargeRouter from "./RechargeRouter"
import PlayerRouter from "./PlayerRouter"
import ReviewRouter from "./ReviewRouter"
import ConversationRouter from "./ConversationRouter"
import MessageRouter from "./MessageRouter"
import HireRouter from "./HireRouter"
import ServiceUploadRouter from "./ServiceUploadRouter"
import NotificationRouter from "./NotificationRouter"
import DonateRouter from "./DonateRouter"
import AdminRouter from "./AdminRouter"
import BalanceFluctuationRouter from "./BalanceFluctuationRouter"

const router = express.Router()

router.use("/admin", AdminRouter)
router.use("/users", UserRouter)
router.use("/players", PlayerRouter)
router.use("/auth", AuthRouter)
router.use("/recharges", RechargeRouter)
router.use("/reviews", ReviewRouter)
router.use("/conversations", ConversationRouter)
router.use("/messages", MessageRouter)
router.use("/hires", HireRouter)
router.use("/service-upload", ServiceUploadRouter)
router.use("/notifications", NotificationRouter)
router.use("/donates", DonateRouter)
router.use("/balance-fluctuations", BalanceFluctuationRouter)
export default router
