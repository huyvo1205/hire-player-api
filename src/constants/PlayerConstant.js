const STATUS_HIRE = {
    READY: 1,
    BUSY: 2
}

const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
}

const TYPES = {
    VIP: 1,
    HOT: 2,
    NEW: 3
}

const SUCCESS_CODES = {
    GET_PLAYER_INFO_SUCCESS: "GET_PLAYER_INFO_SUCCESS",
    CREATE_PLAYER_INFO_SUCCESS: "CREATE_PLAYER_INFO_SUCCESS",
    UPDATE_PLAYER_INFO_SUCCESS: "UPDATE_PLAYER_INFO_SUCCESS",
    UPLOAD_IMAGES_SUCCESS: "UPLOAD_IMAGES_SUCCESS"
}

const ERROR_CODES = {
    ERROR_PLAYER_NOT_FOUND: "ERROR_PLAYER_NOT_FOUND",
    ERROR_USER_ALREADY_CREATE_PLAYER_INFO: "ERROR_USER_ALREADY_CREATE_PLAYER_INFO"
}

export default { STATUS_HIRE, STATUS, SUCCESS_CODES, ERROR_CODES, TYPES }
