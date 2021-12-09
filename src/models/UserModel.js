import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import * as CreateError from "http-errors";
import toJSON from "./plugins/toJSON";
import paginate from "./plugins/paginate";
import { GENDER, STATUS } from "../constants/UserConstant";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserSchema = mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    nickName: { type: String, trim: true },
    gender: { type: Number, enum: Object.values(GENDER) },
    avatar: { type: String },
    playerInfo: { type: ObjectId, ref: "PlayerInfo" },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    googleId: { type: String },
    isOnline: { type: Boolean, default: false },
    status: {
      type: Number,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    deletedAt: { type: Date },
    deletedBy: { type: ObjectId, default: null },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    roles: { type: [String] },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new CreateError.BadRequest(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(toJSON());
UserSchema.plugin(paginate);

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
