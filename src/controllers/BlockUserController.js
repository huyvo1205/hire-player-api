import BlockUserService from "../services/BlockUserService"
import UserValidator from "../validators/UserValidator"
import BlockUserValidator from "../validators/BlockUserValidator"
import BlockUserConstant from "../constants/BlockUserConstant"
import pick from "../utils/pick"

class BlockUserController {
    async getBlockUsers(req, res) {
        const userIdLogin = req.user.id
        const filter = {
            blocker: userIdLogin,
            deletedAt: { $eq: null }
        }
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const blockUsers = await BlockUserService.getListBlockUsers(filter, options)
        return res.status(200).send({
            data: blockUsers,
            message: BlockUserConstant.SUCCESS_CODES.GET_BLOCK_USERS_SUCCESS
        })
    }

    async getDetailBlockUser(req, res) {
        const blockUserId = req.params.id
        const blockUser = await BlockUserValidator.validateGetBlockUser(blockUserId)
        res.status(200).send({
            data: blockUser,
            message: BlockUserConstant.SUCCESS_CODES.GET_DETAIL_BLOCK_USER_SUCCESS
        })
    }

    async deleteBlockUser(req, res) {
        const blockUserId = req.params.id
        await BlockUserValidator.validateGetBlockUser(blockUserId)
        const dataUpdate = { deletedAt: new Date() }
        await BlockUserService.updateBlockUser(blockUserId, dataUpdate)
        res.status(204).send({
            message: BlockUserConstant.SUCCESS_CODES.DELETE_BLOCK_USER_SUCCESS
        })
    }

    async blockUser(req, res) {
        const userIdLogin = req.user.id
        const { userId, reason } = req.body
        await UserValidator.validateUser(userId)
        await BlockUserValidator.validateCreateBlockUser({ userBlocked: userId, blocker: userIdLogin })
        const dataCreate = {
            reason,
            userBlocked: userId,
            blocker: userIdLogin
        }
        const blockUser = await BlockUserService.createBlockUser(dataCreate)
        res.status(200).send({
            data: blockUser,
            message: BlockUserConstant.SUCCESS_CODES.CREATE_BLOCK_USER_SUCCESS
        })
    }
}

export default new BlockUserController()
