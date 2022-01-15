import UserModel from "../models/UserModel"

class UserService {
    async updateUser(id, updateData) {
        const newUser = await UserModel.findOneAndUpdate({ _id: id }, updateData, { new: true })
        return newUser
    }
}

export default new UserService()
