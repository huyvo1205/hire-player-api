import express from "express"
import UsersRouter from "./UsersRouter"
import AuthRouter from "./AuthRouter"

const router = express.Router()

router.use("/users", UsersRouter)
router.use("/auth", AuthRouter)
export default router
