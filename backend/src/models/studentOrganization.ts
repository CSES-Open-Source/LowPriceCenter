import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const studentOrganizationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  contactInfo: {
    email: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    other: {
      type: String,
      default: "",
    },
  },
  merchLocation: {
    type: String,
    default: "",
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
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

export type StudentOrganization = HydratedDocument<InferSchemaType<typeof studentOrganizationSchema>>;

export default model<StudentOrganization>("StudentOrganization", studentOrganizationSchema);

