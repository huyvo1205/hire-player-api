import { mongoObjectId } from "./SharedSchema"
import RechargeConstant from "../constants/RechargeConstant"

const rechargePaypal = {
    type: "object",
    required: ["amount"],
    properties: {
        amount: { type: "number", minimum: 0 }
    }
}

const rechargeStripe = {
    type: "object",
    required: ["paymentMethodId", "amount"],
    properties: {
        amount: { type: "number", minimum: 0 },
        paymentMethodId: { type: "string" }
    }
}

const rechargeRazorpay = {
    type: "object",
    required: ["amount"],
    properties: {
        amount: { type: "number", minimum: 0 }
    }
}

export default { rechargePaypal, rechargeStripe, rechargeRazorpay }
