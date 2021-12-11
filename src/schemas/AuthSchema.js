import { mongoObjectId } from "./SharedSchema"

const register = {
    type: "object",
    required: ["firstName", "lastName", "email", "password", "otp", "hash"],
    properties: {
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 },
        hash: { type: "string", minLength: 1 },
        otp: { type: "string", minLength: 1 },
        email: { type: "string", pattern: "^\\S+@\\S+\\.\\S+$" },
        password: {
            type: "string",
            minLength: 8
        }
    }
}

const login = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            pattern: "^\\S+@\\S+\\.\\S+$"
        },
        password: {
            type: "string"
        }
    }
}

const refreshToken = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: { type: "string" }
    }
}

const logout = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: { type: "string" }
    }
}

const sendOtp = {
    type: "object",
    required: ["email"],
    properties: {
        email: {
            type: "string",
            pattern: "^\\S+@\\S+\\.\\S+$"
        }
    }
}

const requestResetPassword = {
    type: "object",
    required: ["email"],
    properties: {
        email: {
            type: "string",
            pattern: "^\\S+@\\S+\\.\\S+$"
        }
    }
}

const resetPassword = {
    type: "object",
    required: ["userId", "token", "password"],
    properties: {
        userId: mongoObjectId,
        token: { type: "string", minLength: 1 },
        password: {
            type: "string",
            minLength: 8
        }
    }
}
export { register, login, refreshToken, logout, sendOtp, resetPassword, requestResetPassword }
