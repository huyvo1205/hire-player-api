import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import Token from "../models/Token";
import { tokenTypes } from "../config/tokens";
import { getUserByEmail } from "./UsersService";
import User from "../models/User";

export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

export const registerUser = async (name, email, password, roles = []) => {
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const user = await User.create({
    name,
    email,
    password,
    roles,
  });

  return user;
};

export const logout = async (accessToken) => {
  const accessTokenDoc = await Token.findOne({
    token: accessToken,
    type: tokenTypes.ACCESS,
    blacklisted: false,
  });
  if (!accessTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};
