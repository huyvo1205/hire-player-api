import { mongoObjectId } from "./SharedSchema"

const createPlayerInfo = {
    type: "object",
    required: ["gameName", "userId", "costPerHour"],
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
        gameName: { type: "string" },
        rank: { type: "string" },
        costPerHour: { type: "number" },
        description: { type: "string" }
    }
}

export default { createPlayerInfo, updatePlayerInfo }
