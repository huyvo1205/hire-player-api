import { mongoObjectId } from "./SharedSchema"
import RechargeConstant from "../constants/RechargeConstant"

const payoutPaypal = {
    type: "object",
    required: ["amount", "email"],
    properties: {
        amount: { type: "number", minimum: 1 },
        email: { type: "string" }
    }
}

export default {
    payoutPaypal
}
