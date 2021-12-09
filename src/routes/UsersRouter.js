import express from "express";
import {
  createRootUser,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/UsersController";
import auth from "../middlewares/auth";
import { permissions } from "../config/roles";

const router = express.Router();
router.get("/", auth(permissions.manageUsers), getUsers);
router.post("/", auth(permissions.manageUsers), createUser);
router.put("/:userId", auth(permissions.manageUsers), updateUser);
router.delete("/:userId", auth(permissions.manageUsers), deleteUser);
router.get("/:userId", auth(permissions.manageUsers), getUser);
router.post("/root", createRootUser);

export default router;
