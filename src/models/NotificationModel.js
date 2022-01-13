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
        receiver: { type: ObjectId, ref: "User", index: true },
        action: { type: Number, enum: Object.values(NotificationConstant.ACTIONS), index: true },
        href: String, // hires/61976bbda6125e5448f0e01e
        payload: {
            conversation: { type: ObjectId, ref: "Conversation", index: true },
            hire: { type: ObjectId, ref: "Hire", index: true },
            review: { type: ObjectId, ref: "Review" }
        },
        image: {},
        deletedAt: Date,
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
