import * as CreateError from "http-errors"
import AuthService from "../services/AuthService"
import AuthValidator from "../validators/AuthValidator"
import AuthHelper from "../helpers/AuthHelper"
import { ERROR_CODES, SUCCESS_CODES } from "../constants/UserConstant"

class AuthController {
    async login(req, res) {
        const { email, password } = req.body
        const userInfo = await AuthValidator.validateUserLogin({ email, password })
        const payload = { id: userInfo.id }
        const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
        return res.status(200).send({ userInfo, accessToken, refreshToken, message: SUCCESS_CODES.LOGIN_SUCCESS })
    }

    async register(req, res) {
        const data = await AuthValidator.validateCreateUser(req.body)
        const userInfo = await AuthService.createUser(data)
        const payload = { id: userInfo.id }
        const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
        return res.status(200).send({ userInfo, accessToken, refreshToken, message: SUCCESS_CODES.REGISTER_SUCCESS })
    }

    async logout(req, res) {
        const { refreshToken } = req.body
        await AuthService.removeToken(refreshToken)
        return res.status(200).send({ userInfo: null, message: SUCCESS_CODES.LOGOUT_SUCCESS })
    }

    getProfile(req, res) {
        if (!req.user) throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND)
        res.status(200).send({ userInfo: req.user, message: SUCCESS_CODES.GET_PROFILE_SUCCESS })
    }
}

export default new AuthController()
