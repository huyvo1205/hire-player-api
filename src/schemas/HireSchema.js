import { mongoObjectId } from "./SharedSchema"

const createHire = {
    type: "object",
    required: ["playerId", "timeRent"],
    properties: {
        playerId: mongoObjectId,
        timeRent: { type: "number", minimum: 0 },
        customerNote: { type: "string" }
    }
}

const updateHire = {
    type: "object",
    required: [],
    properties: {
        timeRent: { type: "number", minimum: 0 },
        customerNote: { type: "string" }
    }
}

const cancelHire = {
    type: "object",
    required: ["cancelReason"],
    properties: {
        cancelReason: { type: "string", minLength: 1 }
    }
}

export default { createHire, updateHire, cancelHire }
