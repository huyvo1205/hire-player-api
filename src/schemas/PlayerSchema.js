import { mongoObjectId } from "./SharedSchema"

const createPlayerInfo = {
    type: "object",
    required: ["userId"],
    properties: {
        gameName: { type: "string" },
        rank: { type: "string" },
        costPerHour: { type: "number" },
        description: { type: "string" },
        userId: mongoObjectId
    }
}

const updatePlayerInfo = {
    type: "object",
    required: [],
    properties: {
        playerName: { type: "string" },
        gameName: { type: "string" },
        rank: { type: "string" },
        costPerHour: { type: "number" },
        description: { type: "string" }
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

export default { createPlayerInfo, updatePlayerInfo, updateHireSettings }
