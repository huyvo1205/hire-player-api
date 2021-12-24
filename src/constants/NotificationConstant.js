const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
}
const TYPES = {
    SYSTEM: 1,
    NORMAL: 2,
    HIRE: 3
}
const ACTIONS = {
    REQUEST_HIRE: 1,
    ACCEPT_HIRE: 2,
    PLAYER_CANCEL_HIRE: 3,
    CUSTOMER_CANCEL_HIRE: 4,
    REQUEST_COMPLAIN: 5
}

const POPULATE_CUSTOMER = { path: "customer" }
const POPULATE_PLAYER = { path: "player" }

const SYSTEM_NOTIFICATIONS_COLLECTION = "system_notifications"
const SUCCESS_CODES = {
    CREATE_CONVERSATION_SUCCESS: "CREATE_CONVERSATION_SUCCESS",
    GET_CONVERSATIONS_SUCCESS: "GET_CONVERSATIONS_SUCCESS",
    GET_DETAIL_CONVERSATION_SUCCESS: "GET_DETAIL_CONVERSATION_SUCCESS",
    DELETE_CONVERSATION_SUCCESS: "DELETE_CONVERSATION_SUCCESS",
    UPDATE_CONVERSATION_SUCCESS: "UPDATE_CONVERSATION_SUCCESS"
}

const ERROR_CODES = {
    ERROR_CONVERSATION_NOT_FOUND: "ERROR_CONVERSATION_NOT_FOUND",
    ERROR_USER_NOT_IN_CONVERSATION: "ERROR_USER_NOT_IN_CONVERSATION",
    ERROR_MEMBERS_NOT_FOUND: "ERROR_MEMBERS_NOT_FOUND",
    ERROR_USER_REVIEWER_NOT_FOUND: "ERROR_USER_REVIEWER_NOT_FOUND",
    ERROR_USER_RECEIVER_NOT_FOUND: "ERROR_USER_RECEIVER_NOT_FOUND"
}

export default {
    POPULATE_PLAYER,
    ACTIONS,
    TYPES,
    STATUS,
    SUCCESS_CODES,
    ERROR_CODES,
    POPULATE_CUSTOMER,
    SYSTEM_NOTIFICATIONS_COLLECTION
}
