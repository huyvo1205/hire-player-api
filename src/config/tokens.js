export const tokenTypes = {
    ACCESS: "access"
}

export const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "24h"
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-token-secret"
export const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || "1y"
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret"
export const HASH_SECRET = process.env.HASH_SECRET || "hash-secret"
