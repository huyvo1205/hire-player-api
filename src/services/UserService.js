import UserModel from "../models/UserModel"

class UserService {
    async updateUser(id, updateData) {
        await UserModel.updateOne({ _id: id }, updateData)
        const user = await UserModel.findById(id).populate({ path: "player" })
        return user
    }
}

export default new UserService()
