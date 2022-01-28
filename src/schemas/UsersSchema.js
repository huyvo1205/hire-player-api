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

export default { getList, updateUserInfo }
