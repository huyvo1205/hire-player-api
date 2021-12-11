import * as CreateError from "http-errors"
import AuthService from "../services/AuthService"
import AuthValidator from "../validators/AuthValidator"
import AuthHelper from "../helpers/AuthHelper"
import { ERROR_CODES, SUCCESS_CODES, STATUS } from "../constants/UserConstant"
import { updateUserByIdNotPermission } from "../services/UsersService"

class AuthController {
    async login(req, res) {
        const { email, password } = req.body
        const userInfo = await AuthValidator.validateUserLogin({ email, password })
        const payload = { id: userInfo.id }
        const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
        return res.status(200).send({ userInfo, accessToken, refreshToken, message: SUCCESS_CODES.LOGIN_SUCCESS })
    }

    async register(req, res) {
        const { otp, hash, email } = req.body
        const data = await AuthValidator.validateCreateUser(req.body)
        const params = { otp, hash, email }
        AuthValidator.validateOtp(params)
        /* update status for user */
        data.status = STATUS.VERIFIED
        data.emailVerifiedAt = new Date()
        const userInfo = await AuthService.createUser(data)
        const payload = { id: userInfo.id }
        const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
        return res.status(200).send({ userInfo, accessToken, refreshToken, message: SUCCESS_CODES.REGISTER_SUCCESS })
    }

    async sendOtp(req, res) {
        const { email } = req.body
        const { otp, hash } = await AuthHelper.generateHash(email)
        await AuthHelper.sendMailOtp({ otp, email })
        return res.status(200).send({ hash, email, message: SUCCESS_CODES.SEND_OTP_SUCCESS })
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

    async requestResetPassword(req, res) {
        const { email } = req.body
        const link = await AuthValidator.validateRequestResetPassword({ email })
        await AuthHelper.sendMailRequestResetPassword({ email, link })
        return res.status(200).send({ message: SUCCESS_CODES.REQUEST_RESET_PASSWORD_SUCCESS })
    }

    async resetPassword(req, res) {
        const { userId, token, password } = req.body
        const newPassword = await AuthValidator.validateResetPassword({ userId, token, password })
        const dataUpdate = { password: newPassword }
        const newUser = await updateUserByIdNotPermission(userId, dataUpdate)
        await AuthHelper.sendMailResetPasswordSuccess({ email: newUser.email })
        return res.status(200).send({ userInfo: newUser, message: SUCCESS_CODES.RESET_PASSWORD_SUCCESS })
    }
}

export default new AuthController()
