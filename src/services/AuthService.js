/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import UserModel from "../models/UserModel"
import TokenModel from "../models/TokenModel"

class AuthService {
    async removeToken(refreshToken) {
        return TokenModel.deleteOne({ refreshToken })
    }

    async getToken(condition = {}) {
        return TokenModel.finOne(condition)
    }

    async createUser(data) {
        const user = new UserModel(data)
        await user.save()
        return user
    }

    async storageRefreshToken(data) {
        const refreshToken = await TokenModel.findOneAndUpdate({ user: data.user }, data, { upsert: true })
        return refreshToken
    }

    async migrateData() {}
}

export default new AuthService()
