import * as CreateError from "http-errors"
import BlockUserConstant from "../constants/BlockUserConstant"
import BlockUserModel from "../models/BlockUserModel"

class BlockUserValidator {
    async validateCreateBlockUser({ userBlocked, blocker }) {
        const blockUser = await BlockUserModel.findOne({
            userBlocked,
            blocker,
            deletedAt: { $eq: null }
        })

        if (blockUser) {
            throw new CreateError.BadRequest(BlockUserConstant.ERROR_CODES.ERROR_USER_ALREADY_BLOCK_THIS_USER)
        }
    }

    async validateGetBlockUser(blockUserId) {
        const blockUser = await BlockUserModel.findOne({
            _id: blockUserId,
            deletedAt: { $eq: null }
        })
        if (!blockUser) {
            throw new CreateError.NotFound(BlockUserConstant.ERROR_CODES.ERROR_BLOCK_USER_NOT_FOUND)
        }
        return blockUser
    }
}

export default new BlockUserValidator()
