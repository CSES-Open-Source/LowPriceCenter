import { InferSchemaType, model, Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    participants: {
      type: [String],
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
ConversationSchema.virtual("participantsPopulated", {
  ref: "User",
  localField: "participants",
  foreignField: "firebaseUid",
});
ConversationSchema.set("toJSON", { virtuals: true });
ConversationSchema.set("toObject", { virtuals: true });

export type Conversation = InferSchemaType<typeof ConversationSchema>;
export default model<Conversation>("Conversation", ConversationSchema);
