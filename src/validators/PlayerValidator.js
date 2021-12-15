import * as CreateError from "http-errors"
import { ERROR_CODES } from "../constants/UserConstant"
import PlayerConstant from "../constants/PlayerConstant"
import UserModel from "../models/UserModel"
import PlayerModel from "../models/PlayerModel"
import ReviewsModel from "../models/ReviewsModel"

class PlayerValidator {
    async validateCreatePlayerInfo({ userId }) {
        const countUser = await UserModel.countDocuments({ _id: userId })
        if (!countUser) throw new CreateError.NotFound(ERROR_CODES.ERROR_USER_NOT_FOUND)
        const countPlayer = await PlayerModel.countDocuments({ user: userId })
        if (countPlayer)
            throw new CreateError.BadRequest(PlayerConstant.ERROR_CODES.ERROR_USER_ALREADY_CREATE_PLAYER_INFO)
    }

    async validateUpdatePlayerInfo({ playerId }) {
        const player = await PlayerModel.findOne({ _id: playerId })
        if (!player) throw new CreateError.NotFound(PlayerConstant.ERROR_CODES.ERROR_PLAYER_NOT_FOUND)
        return player
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
}

export default new PlayerValidator()
