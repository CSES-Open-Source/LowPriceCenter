import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
  activeUser: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    required: true,
    default: "user",
  },
  lastLogin: {
    type: Date,
    required: true,
  },
  productList: {
    type: [String],
    required: true,
    default: [],
  },
  savedProducts: {
    type: [String],
    required: true,
    default: [],
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
});

export type User = HydratedDocument<InferSchemaType<typeof userSchema>>;

export default model<User>("User", userSchema);
