import { mongoObjectId } from "./SharedSchema"

const createMessage = {
    type: "object",
    required: ["senderId", "text", "conversationId"],
    properties: {
        conversationId: mongoObjectId,
        senderId: mongoObjectId,
        text: { type: "string" },
        media: { type: "array" }
    }
}

const updateMessage = {
    type: "object",
    required: [],
    properties: {
        text: { type: "string" },
        media: { type: "array" }
    }
}

export default { createMessage, updateMessage }
