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
    required: ["number", "expMonth", "expYear", "cvc"],
    properties: {
        number: { type: "number" },
        expMonth: { type: "number" },
        expYear: { type: "number" },
        cvc: { type: "number" }
    }
}

// type: 'card',
//   card: {
//     number: '4242424242424242',
//     exp_month: 1,
//     exp_year: 2023,
//     cvc: '314',
//   },

export { createPaymentSettings, updatePaymentSettings, updatePaymentSettingsCreditCard }
