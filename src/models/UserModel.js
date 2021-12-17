import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import * as CreateError from "http-errors"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import { GENDER, STATUS, ROLES } from "../constants/UserConstant"
import { BCRYPT_SALT } from "../config/tokens"
import PlayerInfoConstant from "../constants/PlayerConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const UserSchema = mongoose.Schema(
    {
        fullName: { type: String, trim: true },
        userName: { type: String, trim: true, required: true, unique: true },
        money: { type: Number, default: 0 },
        gender: { type: Number, enum: Object.values(GENDER) },
        avatar: {},
        playerInfo: {
            gameName: { type: String, trim: true },
            playerName: { type: String, trim: true, index: true, unique: true },
            rank: { type: String, trim: true },
            description: { type: String, trim: true },
            playerAvatar: {},
            costPerHour: { type: Number, default: 0 },
            totalTimeHired: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            avgRating: { type: Number, default: 0 },
            timeReceiveHire: [],
            isReceiveHire: { type: Boolean, default: true },
            timeMaxHire: { type: Number, default: 0 },
            images: [],
            statusHire: {
                type: Number,
                enum: Object.values(PlayerInfoConstant.STATUS_HIRE),
                default: PlayerInfoConstant.STATUS_HIRE.READY
            },
            playerVerified: { type: Boolean, default: false },
            deletedAt: { type: Date, default: null },
            status: {
                type: Number,
                enum: Object.values(PlayerInfoConstant.STATUS),
                default: PlayerInfoConstant.STATUS.ACTIVE
            },
            typePlayer: {
                type: Number,
                enum: Object.values(PlayerInfoConstant.TYPES),
                index: true,
                default: PlayerInfoConstant.TYPES.NEW
            }
        },
        googleId: { type: String },
        isOnline: { type: Boolean, default: false },
        isPlayer: { type: Boolean, default: false },
        status: {
            type: Number,
            enum: Object.values(STATUS),
            default: STATUS.ACTIVE
        },
        deletedAt: { type: Date },
        emailVerifiedAt: { type: Date },
        deletedBy: { type: ObjectId, default: null },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email")
                }
            }
        },
        roles: { type: [Number], default: [ROLES.USER] },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new CreateError.BadRequest("Password must contain at least one letter and one number")
                }
            },
            private: true
        }
    },
    { versionKey: false, timestamps: true }
)

UserSchema.plugin(toJSON(false))
UserSchema.plugin(paginate)

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

UserSchema.methods.isPasswordMatch = async function (password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

UserSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, Number(BCRYPT_SALT))
    }
    next()
})

const UserModel = mongoose.model("User", UserSchema)
export default UserModel
