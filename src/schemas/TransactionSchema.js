import { mongoObjectId } from "./SharedSchema"
import TransactionConstant from "../constants/TransactionConstant"

const recharge = {
    type: "object",
    required: ["method", "userId", "amount"],
    properties: {
        method: { type: "number", enum: Object.values(TransactionConstant.METHOD) },
        amount: { type: "number", minimum: 0 },
        userId: mongoObjectId
    }
}

export default { recharge }
