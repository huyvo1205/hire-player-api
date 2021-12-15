/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import UserModel from "../models/UserModel"
import TokenModel from "../models/TokenModel"
import PlayerModel from "../models/PlayerModel"

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

    async migrateData() {
        const users = await UserModel.find({})
        let count = 0
        for (const user of users) {
            count += 1
            const userName = `Best_Cao_Thu${count}`
            await UserModel.updateOne({ _id: user.id }, { $set: { userName } })
            await PlayerModel.updateOne({ user: user.id }, { $set: { playerName: userName } })
        }
    }
}

export default new AuthService()
