import { mongoObjectId } from "./SharedSchema"

const createConversation = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: mongoObjectId
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
    required: ["body"],
    properties: {
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

const checkExistConversation = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: mongoObjectId
    }
}

export default {
    createComplain,
    createConversation,
    updateConversation,
    createConversationMessage,
    checkExistConversation
}
