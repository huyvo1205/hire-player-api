import { mongoObjectId } from "./SharedSchema"

const joinChat = {
    type: "object",
    required: ["conversationId"],
    properties: {
        conversationId: mongoObjectId
    }
}

const leaveChat = {
    type: "object",
    required: ["conversationId"],
    properties: {
        conversationId: mongoObjectId
    }
}

export default { joinChat, leaveChat }
