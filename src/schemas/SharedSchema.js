import { SKIP_DEFAULT, LIMIT_DEFAULT } from "../constants/GlobalConstant"

const mongoObjectId = {
    type: "string",
    minLength: 24,
    maxLength: 24,
    pattern: "^[0-9a-fA-F]{24}$"
}

const getListSkip = {
    type: "integer",
    minimum: 0,
    default: SKIP_DEFAULT
}

const getListLimit = {
    type: "integer",
    minimum: 1,
    default: LIMIT_DEFAULT
}

export { getListSkip, getListLimit, mongoObjectId }
