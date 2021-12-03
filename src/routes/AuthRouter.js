import express from "express";
import { login, logout, getProfile, register } from "../controllers/AuthController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/get-profile", auth(), getProfile);

export default router;
