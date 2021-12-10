import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
// import { tokenTypes } from "../config/tokens";

const tokenSchema = mongoose.Schema(
    {
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        }
        // type: {
        //   type: String,
        //   enum: [tokenTypes.ACCESS],
        //   required: true,
        // },
        // expires: {
        //   type: Date,
        //   required: true,
        // },
        // blacklisted: {
        //   type: Boolean,
        //   default: false,
        // },
    },
    { timestamps: true }
)
tokenSchema.index({ user: 1, accessToken: 1 })
tokenSchema.plugin(toJSON())
const TokenModel = mongoose.model("Token", tokenSchema)
export default TokenModel
