/* eslint-disable no-underscore-dangle */
import ReviewsModel from "../models/ReviewsModel"

class ReviewHelper {
    async calculateAvgRating({ userId }) {
        /* get all reviews of userId */
        const result = await ReviewsModel.aggregate([
            { $match: { receiver: userId } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$starPoint" }
                }
            }
        ])
        const avgRating = result ? result[0].avgRating : 0
        return avgRating
    }
}

export default new ReviewHelper()
