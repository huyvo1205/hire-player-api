import AuthService from "../services/AuthService";

const jwt = require("jsonwebtoken");

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "24h";
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "1y";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";

class AuthHelper {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenLife,
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenLife,
    });

    const refreshSave = {
      user: payload.id,
      accessToken,
      refreshToken,
    };

    await AuthService.storageRefreshToken(refreshSave);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, accessTokenSecret);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, refreshTokenSecret);
  }
}

export default new AuthHelper();
