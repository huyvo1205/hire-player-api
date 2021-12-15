import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import PlayerInfoConstant from "../constants/PlayerConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const HirePlayerSchema = mongoose.Schema(
    {
        code: { type: String, trim: true },
        userHire: { type: ObjectId, ref: "User", required: true },
        userReceiveHire: { type: ObjectId, ref: "User", required: true },
        rank: { type: String },
        costPerHour: { type: Number, default: 0 },
        timeReceiveHire: [],
        isReceiveHire: { type: Boolean, default: false },
        timeToRent: { type: Number, default: 0 },
        cost: [],
        statusHire: {
            type: Number,
            enum: Object.values(PlayerInfoConstant.STATUS_HIRE),
            default: PlayerInfoConstant.STATUS.ACTIVE
        },
        message: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
        status: {
            type: Number,
            enum: Object.values(PlayerInfoConstant.STATUS),
            default: PlayerInfoConstant.STATUS.ACTIVE
        }
    },
    { timestamps: true }
)

HirePlayerSchema.plugin(toJSON(false))
HirePlayerSchema.plugin(paginate)

const HirePlayerModel = mongoose.model("PlayerInfo", HirePlayerSchema)
export default HirePlayerModel
