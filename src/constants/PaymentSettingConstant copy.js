const TYPES = {
    PAYPAL: 1,
    BANK: 2
}

const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2
}
const COLLECTION_PAYMENT_SETTINGS = "payment_settings"

const ERROR_CODES = {
    ERROR_USER_ALREADY_CREATE_PAYMENT_SETTING: "ERROR_USER_ALREADY_CREATE_PAYMENT_SETTING",
    ERROR_PAYMENT_SETTING_NOT_FOUND: "ERROR_PAYMENT_SETTING_NOT_FOUND"
}

const SUCCESS_CODES = {
    GET_PAYMENT_SETTING_SUCCESS: "GET_PAYMENT_SETTING_SUCCESS",
    CREATE_PAYMENT_SETTING_SUCCESS: "CREATE_PAYMENT_SETTING_SUCCESS",
    UPDATE_PAYMENT_SETTING_SUCCESS: "UPDATE_PAYMENT_SETTING_SUCCESS"
}

export { TYPES, STATUS, ERROR_CODES, SUCCESS_CODES, COLLECTION_PAYMENT_SETTINGS }
