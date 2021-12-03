import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import { generateAuthTokens } from "../services/TokenService";
import {
  loginUserWithEmailAndPassword,
  logout as logoutService,
  registerUser,
} from "../services/AuthService";

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUserWithEmailAndPassword(email, password);
  const { access } = await generateAuthTokens(user);
  res.send({ userInfo: user, token: access.token });
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid params");
  }
  const user = await registerUser(name, email, password, []);
  const { access } = await generateAuthTokens(user);
  res.send({ userInfo: user, token: access.token });
});

export const logout = catchAsync(async (req, res) => {
  await logoutService(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const getProfile = catchAsync(async (req, res) => {
  try {
    if (!req.user) {
      throw new Error();
    }
    res.send({ userInfo: req.user });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
});
