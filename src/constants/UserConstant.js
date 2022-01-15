const TYPES = {
    FACEBOOK: "facebook",
    EMAIL: "email",
    PHONE: "phone",
    NORMAL: "normal"
}

const STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    VERIFIED: 3
}

const ROLES = {
    ROOT: 1,
    ADMIN: 2,
    USER: 3
}

const ROLE_PERMISSIONS = {
    GET_USERS: "GET_USERS",
    MANAGE_USERS: "MANAGE_USERS",
    ADMIN: "ADMIN"
}

const PERMISSIONS = {
    [ROLES.ROOT]: Object.values(ROLE_PERMISSIONS),
    [ROLES.ADMIN]: [ROLE_PERMISSIONS.ADMIN, ROLE_PERMISSIONS.GET_USERS, ROLE_PERMISSIONS.MANAGE_USERS],
    [ROLES.USER]: []
}

const GENDER = {
    MALE: 1,
    FEMALE: 2
}

const ERROR_CODES = {
    ERROR_USER_NOT_FOUND: "ERROR_USER_NOT_FOUND",
    ERROR_UNAUTHORIZED: "ERROR_INCORRECT_EMAIL_OR_PASSWORD",
    ERROR_EMAIL_ALREADY_EXISTS: "ERROR_EMAIL_ALREADY_EXISTS",
    ERROR_USERNAME_ALREADY_EXISTS: "ERROR_USERNAME_ALREADY_EXISTS",
    ERROR_PASSWORD_INVALID: "ERROR_PASSWORD_INVALID",
    ERROR_USERNAME_INVALID: "ERROR_USERNAME_INVALID",
    ERROR_EMAIL_IS_REQUIRED: "ERROR_EMAIL_IS_REQUIRED",
    ERROR_EMAIL_DOES_NOT_EXIST: "ERROR_EMAIL_DOES_NOT_EXIST",
    ERROR_INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN: "ERROR_INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN"
}

const SUCCESS_CODES = {
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    REGISTER_SUCCESS: "REGISTER_SUCCESS",
    LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
    GET_PROFILE_SUCCESS: "GET_PROFILE_SUCCESS",
    SEND_OTP_SUCCESS: "SEND_OTP_SUCCESS",
    RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
    REQUEST_RESET_PASSWORD_SUCCESS: "REQUEST_RESET_PASSWORD_SUCCESS",
    UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS"
}

export { ROLE_PERMISSIONS, PERMISSIONS, TYPES, STATUS, ROLES, GENDER, ERROR_CODES, SUCCESS_CODES }
