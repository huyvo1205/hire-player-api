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
    ADMIN: 1,
    NORMAL: 2
}

const GENDER = {
    MALE: 1,
    FEMALE: 2
}

const ERROR_CODES = {
    USER_NOT_FOUND: "User not found",
    UNAUTHORIZED: "Incorrect email or password",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    PASSWORD_INVALID: "PASSWORD_INVALID",
    EMAIL_IS_REQUIRED: "EMAIL_IS_REQUIRED"
}

export { TYPES, STATUS, ROLES, GENDER, ERROR_CODES }
