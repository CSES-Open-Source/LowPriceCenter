import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const merchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  studentOrganizationId: {
    type: Schema.Types.ObjectId,
    ref: "StudentOrganization",
    required: true,
  },
  timeCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  timeUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export type Merch = HydratedDocument<InferSchemaType<typeof merchSchema>>;

export default model<Merch>("Merch", merchSchema);

