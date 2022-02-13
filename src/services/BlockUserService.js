import BlockUsersModel from "../models/BlockUserModel"

class BlockUserService {
    async createBlockUser(data) {
        const newBlockUser = await BlockUsersModel.create(data)
        return newBlockUser
    }

    async updateBlockUser(id, updateData) {
        const newBlockUser = await BlockUsersModel.findByIdAndUpdate(id, updateData, { new: true })
        return newBlockUser
    }

    async getDetailBlockUser(id) {
        return BlockUsersModel.findOne({ _id: id })
    }

    async deleteBlockUser(id) {
        return BlockUsersModel.deleteOne({ _id: id })
    }

    async getListBlockUsers(filter, options) {
        const blockUsers = await BlockUsersModel.paginate(filter, options)
        return blockUsers
    }
}

export default new BlockUserService()
