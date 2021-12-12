import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import { TYPES, STATUS, COLLECTION_PAYMENT_SETTINGS } from "../constants/PaymentSettingConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const PaymentSettingSchema = mongoose.Schema(
    {
        methods: [
            {
                _id: false,
                type: { type: Number, enum: Object.values(TYPES) },
                cardId: String,
                email: String
            }
        ],
        user: { type: ObjectId, ref: "User", required: true },
        status: {
            type: Number,
            enum: Object.values(STATUS),
            default: STATUS.ACTIVE
        },
        deletedAt: { type: Date }
    },
    { timestamps: true }
)

PaymentSettingSchema.plugin(toJSON())
PaymentSettingSchema.plugin(paginate)

const PaymentSettingModel = mongoose.model("PaymentSetting", PaymentSettingSchema, COLLECTION_PAYMENT_SETTINGS)
export default PaymentSettingModel
