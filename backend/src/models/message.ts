import { InferSchemaType, model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // refers to firebase uid
    authorUid: {
      type: String,
    },
    // text only for now, do images later
    content: String,
  },
  {
    timestamps: true,
  },
);

export type Message = InferSchemaType<typeof MessageSchema>;
export default model<Message>("Message", MessageSchema);
