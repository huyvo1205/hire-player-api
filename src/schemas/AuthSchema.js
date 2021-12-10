const register = {
    type: "object",
    required: ["firstName", "lastName", "email", "password"],
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
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

export { register, login, refreshToken, logout }
