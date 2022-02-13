import mongoose from "mongoose"
import toJSON from "./plugins/toJSON"
import paginate from "./plugins/paginate"
import BlockUserConstant from "../constants/BlockUserConstant"

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const BlockUserSchema = mongoose.Schema(
    {
        reason: { type: String, required: true },
        userBlocked: { type: ObjectId, ref: "User", required: true },
        blocker: { type: ObjectId, ref: "User", required: true, index: true },
        deletedAt: { type: Date, default: null }
    },
    { versionKey: false, timestamps: true }
)

BlockUserSchema.plugin(toJSON(false))
BlockUserSchema.plugin(paginate)

const BlockUserModel = mongoose.model("BlockUser", BlockUserSchema, BlockUserConstant.COLLECTION_NAME)
export default BlockUserModel
