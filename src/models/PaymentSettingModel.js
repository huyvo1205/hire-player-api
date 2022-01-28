import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import { TYPES, STATUS, COLLECTION_PAYMENT_SETTINGS } from "../constants/PaymentSettingConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const PaymentSettingSchema = mongoose.Schema(
    {
        user: { type: ObjectId, ref: "User", required: true, unique: true },
        deletedAt: { type: Date },
        creditCardConfig: {
            paymentMethods: [],
            customerId: String
        },
        paypalConfig: {
            email: String
        }
    },
    { versionKey: false, timestamps: true }
)

PaymentSettingSchema.plugin(toJSON(false))
PaymentSettingSchema.plugin(paginate)

const PaymentSettingModel = mongoose.model("PaymentSetting", PaymentSettingSchema, COLLECTION_PAYMENT_SETTINGS)
export default PaymentSettingModel
