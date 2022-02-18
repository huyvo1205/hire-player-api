import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import WithdrawConstant from "../constants/WithdrawConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const WithdrawSchema = mongoose.Schema(
    {
        method: { type: String, enum: Object.values(WithdrawConstant.METHODS), required: true },
        user: { type: ObjectId, ref: "User", required: true, index: true },
        key: { type: String, index: true, required: true },
        email: { type: String, index: true, required: true },
        amount: { type: Number },
        note: String,
        payload: Schema.Types.Mixed,
        timeWithdraw: { type: Date, required: true },
        status: { type: String, index: true, enum: Object.values(WithdrawConstant.WITHDRAW_PAYPAL_BATCH_STATUS) }
    },
    { versionKey: false, timestamps: true }
)

WithdrawSchema.plugin(toJSON(false))
WithdrawSchema.plugin(paginate)
const WithdrawModel = mongoose.model("Withdraw", WithdrawSchema)
export default WithdrawModel
