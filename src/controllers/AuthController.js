import * as CreateError from "http-errors"
import url from "url"
import axios from "axios"
import AuthService from "../services/AuthService"
import AuthValidator from "../validators/AuthValidator"
import AuthHelper from "../helpers/AuthHelper"
import { ERROR_CODES, SUCCESS_CODES, STATUS } from "../constants/UserConstant"
import { updateUserByIdNotPermission } from "../services/UsersService"
import RequestBuilder from "../helpers/RequestBuilder"

class AuthController {
    async login(req, res) {
        const { email, password } = req.body
        const userInfo = await AuthValidator.validateUserLogin({ email, password })
        const payload = { id: userInfo.id }
        const { accessToken, refreshToken } = await AuthHelper.generateTokens(payload)
        return res.status(200).send({ data: userInfo, accessToken, refreshToken, message: SUCCESS_CODES.LOGIN_SUCCESS })
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
        const host = url.format({ protocol: req.protocol, host: req.get("host") })
        const createDataPlayer = { playerName: userInfo.userName, userId: userInfo.id }
        const path = `${host}/api/players`
        const headers = { Authorization: `Bearer ${accessToken}` }
        const options = RequestBuilder.withHeaders(headers).makePOST(createDataPlayer).build(path)
        /* create player for user */
        try {
            axios(options)
        } catch (error) {
            console.error("error create player: ", error)
            return res
                .status(200)
                .send({ data: userInfo, accessToken, refreshToken, message: SUCCESS_CODES.REGISTER_SUCCESS })
        }
        return res
            .status(200)
            .send({ data: userInfo, accessToken, refreshToken, message: SUCCESS_CODES.REGISTER_SUCCESS })
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
        return res.status(200).send({ data: null, message: SUCCESS_CODES.LOGOUT_SUCCESS })
    }

    getProfile(req, res) {
        if (!req.user) throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND)
        res.status(200).send({ data: req.user, message: SUCCESS_CODES.GET_PROFILE_SUCCESS })
    }

    async requestResetPassword(req, res) {
        const { email } = req.body
        const host = url.format({ protocol: req.protocol, host: req.get("host") })
        const link = await AuthValidator.validateRequestResetPassword({ email, host })
        await AuthHelper.sendMailRequestResetPassword({ email, link })
        return res.status(200).send({ message: SUCCESS_CODES.REQUEST_RESET_PASSWORD_SUCCESS })
    }

    async resetPassword(req, res) {
        const { userId, token, password } = req.body
        const newPassword = await AuthValidator.validateResetPassword({ userId, token, password })
        const dataUpdate = { password: newPassword }
        const newUser = await updateUserByIdNotPermission(userId, dataUpdate)
        await AuthHelper.sendMailResetPasswordSuccess({ email: newUser.email })
        return res.status(200).send({ data: newUser, message: SUCCESS_CODES.RESET_PASSWORD_SUCCESS })
    }

    async migrateData(req, res) {
        const results = await AuthService.migrateData()
        return res.status(200).send(results)
    }
}

export default new AuthController()
