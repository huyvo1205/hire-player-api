import { mongoObjectId } from "./SharedSchema"

const createDonate = {
    type: "object",
    required: ["toUser", "amount", "message"],
    properties: {
        amount: { type: "number", minimum: 1 },
        message: { type: "string", maxLength: 255, minLength: 1 },
        toUser: mongoObjectId
    }
}

const replyDonate = {
    type: "object",
    required: ["replyMessage"],
    properties: {
        replyMessage: { type: "string", maxLength: 255, minLength: 1 }
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

export default { createDonate, updateDonate, replyDonate }
