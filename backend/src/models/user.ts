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
  lastLogin: {
    type: Date,
    required: true,
  },
  productList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  firebaseUid: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  biography: {
    type: String,
  },
});

export type User = HydratedDocument<InferSchemaType<typeof userSchema>>;

export default model<User>("User", userSchema);
