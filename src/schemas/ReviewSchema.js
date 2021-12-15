import { mongoObjectId } from "./SharedSchema"

const createReview = {
    type: "object",
    required: ["starPoint", "content", "reviewerId", "receiverId"],
    properties: {
        starPoint: { type: "integer", minimum: 0, maximum: 5 },
        content: { type: "string", minLength: 0, maxLength: 255 },
        reviewerId: mongoObjectId,
        receiverId: mongoObjectId
    }
}

const updateReview = {
    type: "object",
    required: [],
    properties: {
        starPoint: { type: "integer", minimum: 0, maximum: 5 },
        content: { type: "string", minLength: 0, maxLength: 255 },
        reviewerId: mongoObjectId,
        receiverId: mongoObjectId
    }
}

export default { createReview, updateReview }
