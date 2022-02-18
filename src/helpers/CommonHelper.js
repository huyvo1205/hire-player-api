/* eslint-disable no-underscore-dangle */
import ReviewsModel from "../models/ReviewsModel"

class CommonHelper {
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

export default new CommonHelper()
