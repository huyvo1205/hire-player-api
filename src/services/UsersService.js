import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import User from "../models/UserModel";

export const createUser = async (userBody, isFirst = false) => {
  if (!isFirst && userBody.roles && userBody.roles.includes("root")) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

export const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

export const getUserById = async (id) => User.findById(id);

export const getUserByEmail = async (email) => User.findOne({ email });

export const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    (user.roles && user.roles.includes("root")) ||
    (updateBody.roles && updateBody.roles.includes("root"))
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.roles.includes("root")) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  await user.remove();
  return user;
};

export const countUsers = async () => User.countDocuments();
