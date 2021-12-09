import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import paginate from "./plugins/paginate";
import { STATUS, STATUS_HIRE } from "../constants/PlayerInfoConstant";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PlayerInfoSchema = mongoose.Schema(
  {
    gameName: { type: String, trim: true },
    user: { type: ObjectId, ref: "User", required: true },
    rank: { type: String },
    costPerHour: { type: Number, default: 0 },
    timeReceiveHire: [],
    isReceiveHire: { type: Boolean, default: false },
    timeMaxHire: { type: Number, default: 0 },
    images: [],
    statusHire: {
      type: Number,
      enum: Object.values(STATUS_HIRE),
      default: STATUS.ACTIVE,
    },
    isOnline: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    status: {
      type: Number,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

PlayerInfoSchema.plugin(toJSON());
PlayerInfoSchema.plugin(paginate);

const PlayerInfoModel = mongoose.model("PlayerInfo", PlayerInfoSchema);
export default PlayerInfoModel;
