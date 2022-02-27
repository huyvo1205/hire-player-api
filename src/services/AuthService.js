/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import FacebookStrategy from "passport-facebook"
import GoogleStrategy from "passport-google-oauth20"
import UserModel from "../models/UserModel"
import TokenModel from "../models/TokenModel"
import Config from "../config/config"

const { FACEBOOK_CALLBACK_URL, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = Config.FACEBOOK_LOGIN
const { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = Config.GOOGLE_LOGIN

class AuthService {
    async removeToken(refreshToken) {
        return TokenModel.deleteOne({ refreshToken })
    }

    loginWithFacebook(passport) {
        passport.use(
            new FacebookStrategy.Strategy(
                {
                    clientID: FACEBOOK_CLIENT_ID,
                    clientSecret: FACEBOOK_CLIENT_SECRET,
                    callbackURL: FACEBOOK_CALLBACK_URL || `/auth/facebook/callback`,
                    profileFields: [
                        "id",
                        "first_name",
                        "last_name",
                        "email",
                        "picture",
                        "displayName",
                        "profileUrl",
                        "gender"
                    ]
                },
                async (accessToken, refreshToken, profile, cb) => {
                    /* save user */
                    const { id: profileId, displayName, emails = [], photos = [] } = profile
                    const email = emails.length ? emails[0].value : `login_facebook_${profileId}@gmail.com`
                    const photo = photos.length ? photos[0].value : ""
                    const newUser = await this.createUserLoginFacebook({
                        profileId,
                        name: displayName,
                        picture: photo,
                        email
                    })
                    return cb(null, newUser)
                }
            )
        )
    }

    loginWithGoogle(passport) {
        passport.use(
            new GoogleStrategy.Strategy(
                {
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    callbackURL: GOOGLE_CALLBACK_URL || "/auth/google/callback"
                },
                async (accessToken, refreshToken, profile, cb) => {
                    const { sub: profileId, name, picture, email } = profile._json
                    const user = await this.createUserLoginGoogle({ profileId, name, picture, email })
                    return cb(null, user)
                }
            )
        )
    }

    async getGoogleAccountFromCode(code) {
        // const { data } = await axios({
        //     url: 'https://graph.facebook.com/v4.0/oauth/access_token',
        //     method: 'get',
        //     params: {
        //         client_id: process.env.APP_ID_GOES_HERE,
        //         client_secret: process.env.APP_SECRET_GOES_HERE,
        //         // redirect_uri: 'https://www.example.com/authenticate/facebook/',
        //         code
        //     }
        // })
        // console.log("data", data) // { access_token, token_type, expires_in }
        // return data.access_token
    }

    async getToken(condition = {}) {
        return TokenModel.finOne(condition)
    }

    async createUserLoginFacebook({ profileId, name, picture, email }) {
        const condition = { email }
        const [userName] = email.split("@")
        const key = (Math.random() + 1).toString(36).substring(2)

        const dataCreate = {
            facebookId: profileId,
            fullName: name,
            avatar: { link: picture },
            userName,
            email,
            emailVerifiedAt: new Date(),
            password: `${Config.SESSION_SECRET}${key}`
        }
        const userFound = await UserModel.findOne(condition)
        if (userFound) return userFound
        const newUser = await UserModel.create(dataCreate)
        return newUser
    }

    async createUserLoginGoogle({ profileId, name, picture, email }) {
        const condition = { email }
        const [userName] = email.split("@")
        const key = (Math.random() + 1).toString(36).substring(2)
        const dataCreate = {
            googleId: profileId,
            fullName: name,
            avatar: { link: picture },
            userName,
            email,
            emailVerifiedAt: new Date(),
            password: `${Config.SESSION_SECRET}${key}`
        }
        const userFound = await UserModel.findOne(condition)
        if (userFound) return userFound
        const newUser = await UserModel.create(dataCreate)
        return newUser
    }

    async createUser(data) {
        const user = new UserModel(data)
        await user.save()
        return user
    }

    async storageRefreshToken(data) {
        const refreshToken = await TokenModel.findOneAndUpdate({ user: data.user }, data, { upsert: true })
        return refreshToken
    }

    async migrateData() { }
}

export default new AuthService()
