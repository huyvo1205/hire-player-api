import ReviewsModel from "../models/ReviewsModel"

class ReviewService {
    async createReview(data) {
        const newReview = await ReviewsModel.create(data)
        const review = await ReviewsModel.findById(newReview.id)
            .populate({ path: "receiver" })
            .populate({ path: "reviewer" })
        return review
    }

    async updateReview(id, updateData) {
        await ReviewsModel.updateOne({ _id: id }, updateData)
        const review = await ReviewsModel.findById(id).populate({ path: "receiver" }).populate({ path: "reviewer" })
        return review
    }

    async getDetailReview(id) {
        return ReviewsModel.findOne({ _id: id }).populate({ path: "receiver" }).populate({ path: "reviewer" })
    }

    async deleteReview(id) {
        return ReviewsModel.deleteOne({ _id: id })
    }

    async getListReviews(filter, options) {
        const reviews = await ReviewsModel.paginate(filter, options)
        return reviews
    }
}

export default new ReviewService()
