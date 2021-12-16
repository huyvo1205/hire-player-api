import ReviewConstant from "../constants/ReviewConstant"
import PlayerValidator from "../validators/PlayerValidator"
import ReviewService from "../services/ReviewService"
import PlayerService from "../services/PlayerService"
import pick from "../utils/pick"
import ReviewHelper from "../helpers/ReviewHelper"

class ReviewController {
    async getReviews(req, res) {
        const { reviewerId, receiverId, status, starPoint } = req.query
        const filter = {}
        if (reviewerId) filter.reviewer = reviewerId
        if (receiverId) filter.receiver = receiverId
        if (status) filter.status = status
        if (starPoint) filter.starPoint = starPoint
        const options = pick(req.query, ["sortBy", "limit", "page", "populate"])
        const players = await ReviewService.getListReviews(filter, options)
        return res.status(200).send({
            data: players,
            message: ReviewConstant.SUCCESS_CODES.GET_REVIEWS_SUCCESS
        })
    }

    async createReview(req, res) {
        const { reviewerId, receiverId } = req.body
        await PlayerValidator.validateCreateReview({ reviewerId, receiverId })
        const createData = {
            ...req.body,
            reviewer: reviewerId,
            receiver: receiverId
        }
        const createReview = await ReviewService.createReview(createData)
        /* update avg rating for player */
        const playerId = receiverId
        const avgRating = await ReviewHelper.calculateAvgRating({ playerId })
        const updateDataPlayer = { avgRating }
        await PlayerService.updatePlayerInfo(playerId, updateDataPlayer)
        res.status(201).send({
            data: createReview,
            message: ReviewConstant.SUCCESS_CODES.CREATE_REVIEW_SUCCESS
        })
    }

    async updateReview(req, res) {
        const reviewId = req.params.id
        const { reviewerId, receiverId } = req.body
        await PlayerValidator.validateUpdateReview({ reviewId })
        const updateData = { ...req.body }
        if (reviewerId) updateData.reviewer = reviewerId
        if (receiverId) updateData.receiver = receiverId
        const updateReview = await ReviewService.updateReview(reviewId, updateData)
        res.status(200).send({
            data: updateReview,
            message: ReviewConstant.SUCCESS_CODES.UPDATE_REVIEW_SUCCESS
        })
    }

    async getDetailReview(req, res) {
        const reviewId = req.params.id
        await PlayerValidator.validateGetReview({ reviewId })
        const review = await ReviewService.getDetailReview(reviewId)
        res.status(200).send({
            data: review,
            message: ReviewConstant.SUCCESS_CODES.GET_DETAIL_REVIEW_SUCCESS
        })
    }

    async deleteReview(req, res) {
        const reviewId = req.params.id
        await PlayerValidator.validateGetReview({ reviewId })
        await ReviewService.deleteReview(reviewId)
        res.status(200).send({
            message: ReviewConstant.SUCCESS_CODES.DELETE_REVIEW_SUCCESS
        })
    }
}

export default new ReviewController()
