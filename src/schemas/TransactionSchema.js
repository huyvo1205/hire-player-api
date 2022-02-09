import { mongoObjectId } from "./SharedSchema"
import RechargeConstant from "../constants/RechargeConstant"

const rechargePaypal = {
    type: "object",
    required: ["amount"],
    properties: {
        amount: { type: "number", minimum: 1 }
    }
}

const rechargeStripe = {
    type: "object",
    required: ["paymentMethodId", "amount"],
    properties: {
        amount: { type: "number", minimum: 1 },
        paymentMethodId: { type: "string" }
    }
}

const rechargeRazorpay = {
    type: "object",
    required: ["amount"],
    properties: {
        amount: { type: "number", minimum: 1 }
    }
}

const rechargeRazorpayVerify = {
    type: "object",
    required: ["razorpayPaymentId", "razorpayOrderId", "razorpaySignature"],
    properties: {
        razorpayPaymentId: { type: "string" },
        razorpayOrderId: { type: "string" },
        razorpaySignature: { type: "string" }
    }
}

export default { rechargePaypal, rechargeStripe, rechargeRazorpay, rechargeRazorpayVerify }
