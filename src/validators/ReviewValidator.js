import * as CreateError from "http-errors"
import ReviewConstant from "../constants/ReviewConstant"
import HireConstant from "../constants/HireConstant"
import ReviewsModel from "../models/ReviewsModel"

class ReviewValidator {
    async validateCreateReview({ customer, reviewer, hireId, hire }) {
        if (reviewer.toString() !== customer.toString()) {
            throw new CreateError.BadRequest(ReviewConstant.ERROR_CODES.ERROR_ONLY_CUSTOMER_CREATE_REVIEW)
        }
        const review = await ReviewsModel.findOne({
            hire: hireId,
            reviewer
        })

        if (review) {
            throw new CreateError.BadRequest(ReviewConstant.ERROR_CODES.ERROR_CUSTOMER_ALREADY_REVIEW_THIS_HIRE)
        }

        if (hire.hireStep !== HireConstant.HIRE_STEPS.COMPLETE) {
            throw new CreateError.BadRequest(ReviewConstant.ERROR_CODES.ERROR_HIRE_NOT_COMPLETE)
        }
    }
}

export default new ReviewValidator()
