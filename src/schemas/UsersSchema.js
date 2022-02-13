import { getListSkip, getListLimit } from "./SharedSchema"
import { GENDER } from "../constants/UserConstant"

const getList = {
    type: "object",
    properties: {
        skip: getListSkip,
        limit: getListLimit
    }
}

const updateUserInfo = {
    type: "object",
    required: [],
    properties: {
        fullName: { type: "string", maxLength: 70 },
        gender: { type: "integer", enum: Object.values(GENDER) }
    }
}

const changePassword = {
    type: "object",
    required: ["oldPassword", "newPassword", "confirmPassword"],
    properties: {
        oldPassword: { type: "string" },
        newPassword: { type: "string" },
        confirmPassword: { type: "string" }
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

export default { getList, updateUserInfo, changePassword, blockUser }
