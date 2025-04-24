import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/storage");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  cb(null, true);
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadImages = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).array("images", 10);

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");

export const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
}).array("files", 10);

export const getFileUrl = (filename: string) => {
  return `/storage/${filename}`;
};

export const deleteFile = (filename: string) => {
  const filePath = path.join(__dirname, "../../public/storage", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

export const handleUploadError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }
  next();
};
