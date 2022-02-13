import { getListSkip, getListLimit } from "./SharedSchema"

const getList = {
    type: "object",
    properties: {
        skip: getListSkip,
        limit: getListLimit
    }
}

const blockUser = {
    type: "object",
    required: ["userId", "reason"],
    properties: {
        userId: { type: "string" },
        reason: { type: "string" }
    }
}

export default { getList, blockUser }
