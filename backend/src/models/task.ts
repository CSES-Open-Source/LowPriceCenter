import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  isChecked: { type: Boolean, default: false },
  // Note that dateCreated has type Date, which is MongoDB's recommended format
  // for storing dates (as opposed to, say, strings or numbers--see
  // https://www.mongodb.com/developer/products/mongodb/bson-data-types-date/).
  // When we send a Task object in the JSON body of an API response, the date
  // will automatically get "serialized" into a standard date string.
  dateCreated: { type: Date, required: true },
});

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);
