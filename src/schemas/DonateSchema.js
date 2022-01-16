import { mongoObjectId } from "./SharedSchema"

const createDonate = {
    type: "object",
    required: ["toUser", "amount", "message"],
    properties: {
        amount: { type: "number", minimum: 1 },
        message: { type: "string", maxLength: 255 },
        toUser: mongoObjectId
    }
}

const updateDonate = {
    type: "object",
    required: [],
    properties: {
        amount: { type: "number", minimum: 1 },
        message: { type: "string", maxLength: 255 },
        toUser: mongoObjectId
    }
}

export default { createDonate, updateDonate }
