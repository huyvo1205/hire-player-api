import mongoose from "mongoose"
import autoIncrement from "mongoose-auto-increment"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import TransactionConstant from "../constants/TransactionConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types
autoIncrement.initialize(mongoose.connection)
const TransactionSchema = mongoose.Schema(
    {
        code: { type: String, unique: true, index: true },
        note: { type: String, trim: true },
        status: {
            type: Number,
            enum: Object.values(TransactionConstant.STATUS),
            default: TransactionConstant.STATUS.PROCESSING
        },
        user: { type: ObjectId, ref: "User", required: true },
        paymentMethod: { type: String },
        payerInfo: { type: String },
        email: { type: Number, default: 0 },
        transactionData: {},
        amount: { type: Number, default: false },
        transactionAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null }
    },
    { versionKey: false, timestamps: true }
)
TransactionSchema.plugin(autoIncrement.plugin, {
    model: "Transaction",
    field: "code",
    startAt: 100,
    incrementBy: 1
})
TransactionSchema.plugin(toJSON(false))
TransactionSchema.plugin(paginate)

const TransactionModel = mongoose.model("Transaction", TransactionSchema)
export default TransactionModel
