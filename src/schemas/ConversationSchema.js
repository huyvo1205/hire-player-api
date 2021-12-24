import { mongoObjectId } from "./SharedSchema"
import ConversationConstant from "../constants/ConversationConstant"
import MessageConstant from "../constants/MessageConstant"

const createConversation = {
    type: "object",
    required: ["customerId", "playerId", "type"],
    properties: {
        customerId: mongoObjectId,
        playerId: mongoObjectId,
        type: {
            type: "number",
            enum: Object.values(ConversationConstant.TYPES)
        }
    }
}

const updateConversation = {
    type: "object",
    required: [],
    properties: {
        latestMessageId: mongoObjectId,
        latestHireId: mongoObjectId
    }
}

const createConversationMessage = {
    type: "object",
    required: ["body", "type"],
    properties: {
        senderId: mongoObjectId,
        type: { type: "number", enum: Object.values(MessageConstant.TYPES) },
        body: {
            type: "object",
            properties: {
                content: { type: "string" },
                attachments: { type: "array" }
            }
        }
    }
}

const createComplain = {
    type: "object",
    required: ["userId", "hireId"],
    properties: {
        userId: mongoObjectId,
        hireId: mongoObjectId
    }
}

export default {
    createComplain,
    createConversation,
    updateConversation,
    createConversationMessage
}
