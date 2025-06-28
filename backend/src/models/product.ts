import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
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
  },
  timeCreated: {
    type: Date,
    required: true,
  },
  timeUpdated: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], 
    enum: ['Electronics', 'School Supplies', 'Dorm Essentials', 'Furniture', 'Clothes', 'Miscellaneous'], 
    required: false
  },
  images: [{ type: String }],
  isSold: {
    type: Boolean,
    default: false,
  }
});

export type Product = HydratedDocument<InferSchemaType<typeof productSchema>>;

export default model<Product>("Product", productSchema);
