import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import BalanceFluctuationConstant from "../constants/BalanceFluctuationConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const BalanceFluctuationSchema = mongoose.Schema(
    {
        amount: { type: Number, default: 0 },
        user: { type: ObjectId, ref: "User", required: true, index: true },
        action: { type: String, required: true, enum: Object.values(BalanceFluctuationConstant.ACTIONS) },
        operation: {
            type: String,
            enum: Object.values(BalanceFluctuationConstant.OPERATIONS)
        }
    },
    { versionKey: false, timestamps: true }
)

BalanceFluctuationSchema.plugin(toJSON(false))
BalanceFluctuationSchema.plugin(paginate)
BalanceFluctuationSchema.index({ action: 1, operation: 1 })
const BalanceFluctuationModel = mongoose.model(
    "BalanceFluctuation",
    BalanceFluctuationSchema,
    BalanceFluctuationConstant.COLLECTION_NAME
)
export default BalanceFluctuationModel
