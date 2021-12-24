import mongoose from "mongoose"
import ConversationConstant from "../constants/ConversationConstant"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const ConversationSchema = new Schema(
    {
        members: [{ type: ObjectId, ref: "User", index: true }],
        customer: { type: ObjectId, ref: "User", index: true },
        player: { type: ObjectId, ref: "User", index: true },
        status: {
            type: Number,
            enum: Object.values(ConversationConstant.STATUS),
            default: ConversationConstant.STATUS.ACTIVE
        },
        type: {
            type: Number,
            enum: Object.values(ConversationConstant.TYPES),
            default: ConversationConstant.TYPES.PRIVATE
        },
        deletedAt: Date,
        latestMessage: {
            id: ObjectId,
            body: {},
            conversation: ObjectId,
            sender: ObjectId,
            createdAt: Date,
            updatedAt: Date,
            unreadStatus: {}
        }
    },
    { versionKey: false, timestamps: true }
)
ConversationSchema.plugin(toJSON(false))
ConversationSchema.plugin(paginate)
const ConversationModel = mongoose.model("Conversation", ConversationSchema)
export default ConversationModel
