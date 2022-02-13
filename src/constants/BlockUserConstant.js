const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
}
const OPERATIONS = {
    PLUS: "+",
    SUBTRACT: "-"
}
const ACTIONS = {
    RECEIVE_MONEY_DONATE: "RECEIVE_MONEY_DONATE",
    DONATE: "DONATE",
    RENT_PLAYER: "RENT_PLAYER",
    RECEIVE_MONEY_HIRE: "RECEIVE_MONEY_HIRE",
    CANCEL_HIRE: "CANCEL_HIRE",
    RECHARGE: "RECHARGE"
}
const COLLECTION_NAME = "block_users"
const SUCCESS_CODES = {
    CREATE_BLOCK_USER_SUCCESS: "CREATE_BLOCK_USER_SUCCESS",
    GET_BLOCK_USERS_SUCCESS: "GET_BLOCK_USERS_SUCCESS",
    GET_DETAIL_BLOCK_USER_SUCCESS: "GET_DETAIL_BLOCK_USER_SUCCESS",
    DELETE_BLOCK_USER_SUCCESS: "DELETE_BLOCK_USER_SUCCESS",
    UPDATE_REVIEW_SUCCESS: "UPDATE_REVIEW_SUCCESS"
}

const ERROR_CODES = {
    ERROR_USER_ALREADY_BLOCK_THIS_USER: "ERROR_USER_ALREADY_BLOCK_THIS_USER",
    ERROR_BLOCK_USER_NOT_FOUND: "ERROR_BLOCK_USER_NOT_FOUND",
    ERROR_USER_RECEIVER_NOT_FOUND: "ERROR_USER_RECEIVER_NOT_FOUND"
}

export default { COLLECTION_NAME, STATUS, SUCCESS_CODES, ERROR_CODES, ACTIONS, OPERATIONS }
