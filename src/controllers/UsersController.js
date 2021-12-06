import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import {
  countUsers,
  deleteUserById,
  getUserById,
  queryUsers,
  updateUserById,
  createUser as createUserService,
} from "../services/UsersService";
import pick from "../utils/pick";
import { roles } from "../config/roles";

export const getUser = catchAsync(async (req, res) => {
  const user = await getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

export const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["email"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const users = await queryUsers(filter, options);
  res.send(users);
});

export const createUser = catchAsync(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

export const createRootUser = catchAsync(async (req, res) => {
  const usersCount = await countUsers();
  if (usersCount > 0) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  const user = await createUserService(
    {
      name: "root",
      email: process.env.ROOT_EMAIL || "root@test.com",
      roles: [roles.root],
      password: process.env.ROOT_PASSWORD || "rootP@55word",
    },
    true
  );
  res.status(httpStatus.CREATED).send({ user });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await updateUserById(req.params.userId, req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req, res) => {
  await deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
