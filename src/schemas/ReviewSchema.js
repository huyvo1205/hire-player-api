const createReview = {
    type: "object",
    required: ["starPoint"],
    properties: {
        starPoint: { type: "integer", minimum: 0, maximum: 5 },
        content: { type: "string", maxLength: 255 }
    }
}

const updateReview = {
    type: "object",
    required: [],
    properties: {
        starPoint: { type: "integer", minimum: 0, maximum: 5 },
        content: { type: "string", maxLength: 255 }
    }
}

export default { createReview, updateReview }
