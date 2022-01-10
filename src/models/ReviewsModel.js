import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import ReviewConstant from "../constants/ReviewConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const ReviewSchema = mongoose.Schema(
    {
        starPoint: { type: Number, default: 0 },
        timeRent: { type: Number, default: 0 },
        content: { type: String, trim: true, maxlength: 255 },
        reviewer: { type: ObjectId, ref: "User", required: true },
        receiver: { type: ObjectId, ref: "User", required: true, index: true },
        hire: { type: ObjectId, ref: "Hire", required: true },
        deletedAt: { type: Date, default: null },
        status: {
            type: Number,
            enum: Object.values(ReviewConstant.STATUS),
            index: true,
            default: ReviewConstant.STATUS.ACTIVE
        }
    },
    { versionKey: false, timestamps: true }
)

ReviewSchema.plugin(toJSON(false))
ReviewSchema.plugin(paginate)

const ReviewModel = mongoose.model("Review", ReviewSchema)
export default ReviewModel
