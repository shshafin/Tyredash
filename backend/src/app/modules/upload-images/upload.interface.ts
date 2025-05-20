import { Document, Model, Schema } from "mongoose";

export interface IMediaInput {
  filename: string;
  url: string;
  userId?: Schema.Types.ObjectId;
}

export interface IMedia extends IMediaInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IMediaModel extends Model<IMedia> {}
