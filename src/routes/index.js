import express from "express"
import UserRouter from "./UserRouter"
import AuthRouter from "./AuthRouter"

const router = express.Router()

router.use("/users", UserRouter)
router.use("/auth", AuthRouter)
export default router
