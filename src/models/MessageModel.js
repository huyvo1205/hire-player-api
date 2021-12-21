import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const MessageSchema = new Schema(
    {
        conversation: { type: ObjectId, ref: "Conversation", index: true },
        sender: { type: ObjectId, ref: "User", index: true },
        body: {
            attachments: [],
            content: String
        },
        deletedAt: Date
    },
    { versionKey: false, timestamps: true }
)

MessageSchema.plugin(toJSON(false))
MessageSchema.plugin(paginate)
MessageSchema.index({ createdAt: -1 })
MessageSchema.index({ updatedAt: -1 })
const MessageModel = mongoose.model("Message", MessageSchema)
export default MessageModel
