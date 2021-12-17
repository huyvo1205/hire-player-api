/* eslint-disable no-underscore-dangle */
import * as _ from "lodash"
import ReviewsModel from "../models/ReviewsModel"

class ReviewHelper {
    async calculateAvgRating({ userId }) {
        /* get all reviews of userId */
        /* TODO: edit group data aggregate */
        const reviews = await ReviewsModel.find({ receiver: userId }).select("starPoint")
        const sumStarPoint = _.sumBy(reviews, item => item.starPoint)
        const avgRating = sumStarPoint / reviews.length
        return avgRating || 0
    }
}

export default new ReviewHelper()
