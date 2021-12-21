import mongoose from "mongoose"
import NotificationConstant from "../constants/NotificationConstant"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const NotificationSchema = new Schema(
    {
        customer: { type: ObjectId, ref: "User" },
        player: { type: ObjectId, ref: "User" },
        content: String,
        action: Number, // playerCancel, accept, create
        href: String, // hires/61976bbda6125e5448f0e01e
        payload: {
            conversationId: { type: ObjectId, ref: "Conversation", index: true },
            hireId: { type: ObjectId, ref: "Hire", index: true }
        },
        type: {
            type: Number,
            enum: Object.values(NotificationConstant.TYPES),
            default: NotificationConstant.TYPES.NORMAL
        },
        image: {},
        isRead: { type: Boolean, default: false }
    },
    { versionKey: false, timestamps: true }
)

NotificationSchema.plugin(toJSON(false))
NotificationSchema.plugin(paginate)
NotificationSchema.index({ createdAt: -1 })
NotificationSchema.index({ updatedAt: -1 })

const MessageModel = mongoose.model("Notification", NotificationSchema)

export default MessageModel
