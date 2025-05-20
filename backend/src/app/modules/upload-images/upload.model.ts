import { model, Schema } from "mongoose";
import { IMedia, IMediaModel } from "./upload.interface";

const MediaSchema = new Schema<IMedia, IMediaModel>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const UploadMedia = model<IMedia, IMediaModel>("Media", MediaSchema);
