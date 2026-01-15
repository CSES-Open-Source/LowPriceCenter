import { InferSchemaType, model, Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
ConversationSchema.index({ participants: 1 }, { unique: true });

export type Conversation = InferSchemaType<typeof ConversationSchema>;
export default model<Conversation>("Conversation", ConversationSchema);
