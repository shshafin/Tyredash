import { IMedia, IMediaInput } from "./upload.interface";
import { UploadMedia } from "./upload.model";

const createMedia = async (mediaData: IMediaInput[]): Promise<IMedia[]> => {
  return await UploadMedia.insertMany(mediaData);
};

export const uploadService = { createMedia };
