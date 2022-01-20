import { mongoObjectId } from "./SharedSchema"

const createPlayerInfo = {
    type: "object",
    required: ["userId"],
    properties: {
        gameName: { type: "string", maxLength: 500 },
        rank: { type: "string", maxLength: 500 },
        costPerHour: { type: "number" },
        description: { type: "string", maxLength: 1000 },
        userId: mongoObjectId
    }
}

const updatePlayerInfo = {
    type: "object",
    required: [],
    properties: {
        playerName: { type: "string", maxLength: 70 },
        gameName: { type: "string", maxLength: 500 },
        rank: { type: "string", maxLength: 255 },
        costPerHour: { type: "number", minimum: 0 },
        description: { type: "string", maxLength: 1000 }
    },
    additionalProperties: false
}

const updateHireSettings = {
    type: "object",
    required: [],
    properties: {
        isReceiveHire: { type: "boolean" },
        timeMaxHire: { type: "number" },
        timeReceiveHire: {
            type: "array",
            items: { type: "integer", minimum: 1, maximum: 24 },
            maxItems: 24,
            uniqueItems: true
        }
    },
    additionalProperties: false
}

const removeImages = {
    type: "object",
    required: ["images"],
    properties: {
        images: {
            type: "array",
            items: {
                type: "object",
                required: ["filename"],
                properties: {
                    filename: { type: "string" }
                }
            },
            minItems: 1,
            uniqueItems: true
        }
    }
}

export default { createPlayerInfo, updatePlayerInfo, updateHireSettings, removeImages }
