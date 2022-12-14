/* eslint-disable no-restricted-syntax */
import * as CreateError from "http-errors"
import PlayerConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import ReviewsModel from "../models/ReviewsModel"
import FileHelper from "../helpers/FileHelper"

class PlayerValidator {
    async validateUpdatePlayerInfo({ userId }) {
        const player = await UserModel.findOne({ _id: userId, isPlayer: true })
        if (!player) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_PLAYER_NOT_FOUND)
        return player
    }

    async validateUploadPlayerImages({ newImages = [], key, imagesUpload = [] }) {
        if (newImages.length > 15) {
            await FileHelper.removeFilesFromDisk({ files: imagesUpload, key })
            throw new CreateError.BadRequest(PlayerConstant.ERROR_CODES.ERROR_ONLY_UPLOAD_FIFTEEN_IMAGES)
        }
    }

    async validateCreateReview({ reviewerId, receiverId }) {
        const countReviewer = await UserModel.countDocuments({ _id: reviewerId })
        if (!countReviewer) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_USER_REVIEWER_NOT_FOUND)
        const countReceiver = await UserModel.countDocuments({ _id: receiverId })
        if (!countReceiver) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_USER_RECEIVER_NOT_FOUND)
    }

    async validateUpdateReview({ reviewId }) {
        const review = await ReviewsModel.findOne({ _id: reviewId })
        if (!review) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_REVIEW_NOT_FOUND)
        return review
    }

    async validateGetReview({ reviewId }) {
        const review = await ReviewsModel.findOne({ _id: reviewId })
        if (!review) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_REVIEW_NOT_FOUND)
        return review
    }

    async validateGetPlayer(id) {
        const player = await UserModel.findOne({ _id: id, isPlayer: true })
        if (!player) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_PLAYER_NOT_FOUND)
        return player
    }
}

export default new PlayerValidator()
