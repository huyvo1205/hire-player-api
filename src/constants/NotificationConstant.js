const ACTIONS = {
    REQUEST_HIRE: 1,
    PLAYER_ACCEPT_HIRE: 2,
    PLAYER_CANCEL_HIRE: 3,
    CUSTOMER_CANCEL_HIRE: 4,
    CUSTOMER_FINISH_SOON: 5,
    CUSTOMER_REQUEST_COMPLAIN: 6,
    COMPLETE: 7,
    REVIEW: 8,
    ADMIN_JOIN_CHAT: 9
}

const POPULATE_CUSTOMER = { path: "customer" }
const POPULATE_PLAYER = { path: "player" }
const POPULATE_HIRE = { path: "payload.hire" }
const POPULATE_REVIEW = { path: "payload.review" }

const SUCCESS_CODES = {
    CREATE_NOTIFICATION_SUCCESS: "CREATE_NOTIFICATION_SUCCESS",
    GET_NOTIFICATIONS_SUCCESS: "GET_NOTIFICATIONS_SUCCESS",
    GET_DETAIL_NOTIFICATION_SUCCESS: "GET_DETAIL_NOTIFICATION_SUCCESS",
    DELETE_NOTIFICATION_SUCCESS: "DELETE_NOTIFICATION_SUCCESS",
    UPDATE_NOTIFICATION_SUCCESS: "UPDATE_NOTIFICATION_SUCCESS",
    READERS_NOTIFICATIONS_SUCCESS: "READERS_NOTIFICATIONS_SUCCESS"
}

const ERROR_CODES = {
    ERROR_NOTIFICATION_NOT_FOUND: "ERROR_NOTIFICATION_NOT_FOUND",
    ERROR_USER_NOT_IN_NOTIFICATION: "ERROR_USER_NOT_IN_NOTIFICATION",
    ERROR_MEMBERS_NOT_FOUND: "ERROR_MEMBERS_NOT_FOUND",
    ERROR_USER_REVIEWER_NOT_FOUND: "ERROR_USER_REVIEWER_NOT_FOUND",
    ERROR_USER_RECEIVER_NOT_FOUND: "ERROR_USER_RECEIVER_NOT_FOUND"
}

export default {
    POPULATE_PLAYER,
    ACTIONS,
    SUCCESS_CODES,
    ERROR_CODES,
    POPULATE_CUSTOMER,
    POPULATE_HIRE,
    POPULATE_REVIEW
}
