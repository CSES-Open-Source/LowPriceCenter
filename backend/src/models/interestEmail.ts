import mongoose from "mongoose";

const InterestEmailSchema = new mongoose.Schema({
  consumerId: { type: String, required: true },
  productId: { type: String, required: true },
  lastSentAt: { type: Date, required: true, default: Date.now },
});
InterestEmailSchema.index({ consumerId: 1, productId: 1 }, { unique: true });

export default mongoose.model("InterestEmail", InterestEmailSchema);
