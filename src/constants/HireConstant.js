const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
}
const TYPES = {
    TEXT: 1,
    MEDIA: 2
}
const HIRE_STEPS = {
    WAITING: 1,
    ACCEPT: 2,
    PLAYER_CANCEL: 3,
    CUSTOMER_CANCEL: 4,
    COMPLETE: 5,
    COMPLAIN: 6
}
const POPULATE_OPTIONS = { path: "sender" }
const POPULATE_CUSTOMER = { path: "customer" }
const POPULATE_PLAYER = { path: "player" }

const SUCCESS_CODES = {
    CREATE_HIRE_SUCCESS: "CREATE_HIRE_SUCCESS",
    GET_MESSAGES_SUCCESS: "GET_MESSAGES_SUCCESS",
    GET_DETAIL_HIRE_SUCCESS: "GET_DETAIL_HIRE_SUCCESS",
    DELETE_MESSAGE_SUCCESS: "DELETE_MESSAGE_SUCCESS",
    UPDATE_MESSAGE_SUCCESS: "UPDATE_MESSAGE_SUCCESS",
    ACCEPT_HIRE_SUCCESS: "ACCEPT_HIRE_SUCCESS",
    COMPLETE_HIRE_SUCCESS: "COMPLETE_HIRE_SUCCESS",
    CANCEL_HIRE_SUCCESS: "CANCEL_HIRE_SUCCESS",
    FINISH_SOON_HIRE_SUCCESS: "FINISH_SOON_HIRE_SUCCESS",
    REQUEST_COMPLAIN_SUCCESS: "REQUEST_COMPLAIN_SUCCESS"
}

const ERROR_CODES = {
    ERROR_HIRE_NOT_FOUND: "ERROR_HIRE_NOT_FOUND",
    ERROR_PLAYER_ID_INVALID: "ERROR_PLAYER_ID_INVALID",
    ERROR_CUSTOMER_ID_INVALID: "ERROR_CUSTOMER_ID_INVALID",
    ERROR_SENDER_NOT_FOUND: "ERROR_SENDER_NOT_FOUND",
    ERROR_USER_REVIEWER_NOT_FOUND: "ERROR_USER_REVIEWER_NOT_FOUND",
    ERROR_USER_RECEIVER_NOT_FOUND: "ERROR_USER_RECEIVER_NOT_FOUND",
    ERROR_USER_NOT_PLAYER: "ERROR_USER_NOT_PLAYER",
    ERROR_PLAYER_NOT_RECEIVE_HIRE: "ERROR_PLAYER_NOT_RECEIVE_HIRE",
    ERROR_PLAYER_BUSY: "ERROR_PLAYER_BUSY",
    ERROR_TIME_RENT_TOO_LONG: "ERROR_TIME_RENT_TOO_LONG",
    ERROR_ONLY_CUSTOMER_REQUEST_COMPLAIN: "ERROR_ONLY_CUSTOMER_REQUEST_COMPLAIN",
    ERROR_ONLY_PLAYER_COMPLETE_HIRE: "ERROR_ONLY_PLAYER_COMPLETE_HIRE",
    ERROR_ONLY_CUSTOMER_FINISH_SOON: "ERROR_ONLY_CUSTOMER_FINISH_SOON",
    ERROR_STATUS_HIRE_INVALID: "ERROR_STATUS_HIRE_INVALID",
    ERROR_PLAYER_NOT_COMPLETE_HIRE: "ERROR_PLAYER_NOT_COMPLETE_HIRE"
}

export default {
    HIRE_STEPS,
    POPULATE_CUSTOMER,
    POPULATE_PLAYER,
    STATUS,
    SUCCESS_CODES,
    ERROR_CODES,
    POPULATE_OPTIONS,
    TYPES
}
