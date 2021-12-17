import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
// import { tokenTypes } from "../config/tokens";

const tokenSchema = mongoose.Schema(
    {
        accessToken: { type: String },
        hash: { type: String },
        refreshToken: { type: String },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        }
    },
    { versionKey: false, timestamps: true }
)
tokenSchema.index({ user: 1, accessToken: 1 })
tokenSchema.plugin(toJSON(false))
const TokenModel = mongoose.model("Token", tokenSchema)
export default TokenModel
