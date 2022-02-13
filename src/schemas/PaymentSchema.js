import { mongoObjectId } from "./SharedSchema"
import { TYPES } from "../constants/PaymentSettingConstant"

const createPaymentSettings = {
    type: "object",
    required: ["methods", "userId"],
    properties: {
        methods: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: { type: "number", enum: Object.values(TYPES) },
                    cardId: { type: "string" },
                    email: { type: "string" }
                }
            }
        },
        userId: mongoObjectId
    }
}

const updatePaymentSettings = {
    type: "object",
    required: ["methods"],
    properties: {
        methods: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: { type: "number", enum: Object.values(TYPES) },
                    cardId: { type: "string" },
                    email: { type: "string" }
                }
            }
        },
        userId: mongoObjectId
    }
}

const updatePaymentSettingsCreditCard = {
    type: "object",
    required: ["paymentMethodId"],
    properties: {
        paymentMethodId: { type: "string" }
    }
}

export { createPaymentSettings, updatePaymentSettings, updatePaymentSettingsCreditCard }
