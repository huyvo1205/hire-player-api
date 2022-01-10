import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const DonateSchema = mongoose.Schema(
    {
        amount: { type: Number, default: 0 },
        message: String,
        fromUser: { type: ObjectId, ref: "User", required: true },
        toUser: { type: ObjectId, ref: "User", required: true }
    },
    { versionKey: false, timestamps: true }
)

DonateSchema.plugin(toJSON(false))
DonateSchema.plugin(paginate)

const BalanceFluctuationModel = mongoose.model("Donate", DonateSchema)
export default BalanceFluctuationModel
