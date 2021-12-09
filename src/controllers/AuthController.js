import * as CreateError from "http-errors";
import AuthService from "../services/AuthService";
import AuthValidator from "../validators/AuthValidator";
import AuthHelper from "../helpers/AuthHelper";

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    const userInfo = await AuthValidator.validateUserLogin({ email, password });
    const payload = { id: userInfo.id };
    const { accessToken, refreshToken } = await AuthHelper.generateTokens(
      payload
    );
    return res.status(200).send({ userInfo, accessToken, refreshToken });
  }

  async register(req, res) {
    const data = await AuthValidator.validateCreateUser(req.body);
    const userInfo = await AuthService.createUser(data);
    const payload = { id: userInfo.id };
    const { accessToken, refreshToken } = await AuthHelper.generateTokens(
      payload
    );
    return res.status(200).send({ userInfo, accessToken, refreshToken });
  }

  async logout(req, res) {
    const { refreshToken } = req.body;
    await AuthService.removeToken(refreshToken);
    return res.status(200).send({ userInfo: null });
  }

  getProfile(req, res) {
    if (!req.user) throw new CreateError.NotFound("User not found");
    res.send({ userInfo: req.user });
  }
}

export default new AuthController();
