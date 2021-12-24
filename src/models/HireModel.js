import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import HireConstant from "../constants/HireConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const HireSchema = mongoose.Schema(
    {
        customer: { type: ObjectId, ref: "User", index: true },
        player: { type: ObjectId, ref: "User", index: true },
        acceptedAt: Date,
        deletedAt: Date,
        seenAt: Date,
        cancelReason: String,
        customerNote: String,
        hireStep: {
            type: Number,
            enum: Object.values(HireConstant.HIRE_STEPS),
            default: HireConstant.HIRE_STEPS.WAITING,
            index: true
        },
        isCompleteSoon: { type: Boolean, default: false },
        rate: Number,
        conversation: { type: ObjectId, ref: "Conversation", index: true },
        timeRent: Number,
        cost: Number
    },
    { versionKey: false, timestamps: true }
)
// hire -> Tạo Conversation -> Tạo Hire gắn conversation vào ->
HireSchema.plugin(toJSON(false))
HireSchema.plugin(paginate)

const HireModel = mongoose.model("Hire", HireSchema)
export default HireModel
