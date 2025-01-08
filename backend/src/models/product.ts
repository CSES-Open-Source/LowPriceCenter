import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
  },
});

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);
