import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { UserModel } from "../models"
import config from "./config"

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

export const jwtVerify = async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.id)
        if (!user) {
            return done(null, false)
        }
        return done(null, user)
    } catch (error) {
        return done(error, false)
    }
}

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)
