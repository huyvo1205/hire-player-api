/* eslint-disable no-underscore-dangle */
import * as _ from "lodash"
import ReviewsModel from "../models/ReviewsModel"

class ReviewHelper {
    async calculateAvgRating({ playerId }) {
        /* get all reviews of playerId */
        const reviews = await ReviewsModel.find({ receiver: playerId }).select("starPoint")
        const sumStarPoint = _.sumBy(reviews, item => item.starPoint)
        const avgRating = sumStarPoint / reviews.length
        return avgRating || 0
    }
}

export default new ReviewHelper()
