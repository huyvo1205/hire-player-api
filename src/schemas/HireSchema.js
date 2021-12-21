import { mongoObjectId } from "./SharedSchema"

const createHire = {
    type: "object",
    required: ["playerId", "customerId", "timeRent", "cost"],
    properties: {
        playerId: mongoObjectId,
        customerId: mongoObjectId,
        timeRent: { type: "number", minimum: 0 },
        cost: { type: "number", minimum: 0 },
        customerNote: { type: "string" }
    }
}

const updateHire = {
    type: "object",
    required: [],
    properties: {
        timeRent: { type: "number", minimum: 0 },
        cost: { type: "number", minimum: 0 },
        customerNote: { type: "string" }
    }
}

export default { createHire, updateHire }
