import { InferSchemaType, Schema, model } from "mongoose";

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
  lastLogin: {
    type: Date,
    required: true,
  },
  productList: {
    type: [String],
    required: true,
    default: [],
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
