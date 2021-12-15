import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import PlayerInfoConstant from "../constants/PlayerConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types
const PlayerSchema = mongoose.Schema(
    {
        gameName: { type: String, trim: true },
        playerName: { type: String, trim: true, required: true, index: true, unique: true },
        user: { type: ObjectId, ref: "User", required: true, index: true },
        rank: { type: String, trim: true },
        description: { type: String, trim: true },
        costPerHour: { type: Number, default: 0 },
        totalTimeHired: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 },
        timeReceiveHire: [],
        isReceiveHire: { type: Boolean, default: true },
        timeMaxHire: { type: Number, default: 0 },
        images: [],
        statusHire: {
            type: Number,
            enum: Object.values(PlayerInfoConstant.STATUS_HIRE),
            default: PlayerInfoConstant.STATUS_HIRE.READY
        },
        isOnline: { type: Boolean, default: false },
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
    { timestamps: true }
)

PlayerSchema.plugin(toJSON(false))
PlayerSchema.plugin(paginate)
PlayerSchema.index({ createdAt: -1 })
PlayerSchema.index({ updatedAt: -1 })
const PlayerModel = mongoose.model("Player", PlayerSchema)
export default PlayerModel
