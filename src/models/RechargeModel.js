import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import RechargeConstant from "../constants/RechargeConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const RechargeSchema = mongoose.Schema(
    {
        method: { type: String, enum: Object.values(RechargeConstant.METHODS), required: true },
        user: { type: ObjectId, ref: "User", required: true, index: true },
        key: { type: String, index: true, required: true },
        payload: Schema.Types.Mixed,
        status: { type: String, index: true, enum: Object.values(RechargeConstant.STATUS) }
    },
    { versionKey: false, timestamps: true }
)

RechargeSchema.plugin(toJSON(false))
RechargeSchema.plugin(paginate)
RechargeSchema.index({ action: 1, operation: 1 })
const RechargeModel = mongoose.model("Recharge", RechargeSchema)
export default RechargeModel
