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
    // const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    // cb(null, uniqueName);
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

// const imageFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//   }
// };

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only .png, .jpg, .jpeg, .gif, and .webp formats are allowed!")
    );
  }
};

// File filter (updated to handle CSV)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "text/plain", // Some CSV files may have this mime type
    "application/csv",
    "application/x-csv",
    "text/x-csv",
    "text/comma-separated-values",
    "text/x-comma-separated-values",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"));
  }
};

// CSV-specific filter (optional, if you want separate handling)
const csvFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    path.extname(file.originalname).toLowerCase() === ".csv"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"));
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

export const uploadImages = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 100 },
}).array("images", 100);

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter, // Now properly checks for CSV
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");

// New dedicated CSV upload middleware
export const uploadCSV = multer({
  storage: storage,
  fileFilter: csvFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("csvfile"); // Using different field name for clarity

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

// export const deleteFile = async (filename: string): Promise<boolean> => {
//   const filePath = path.join(__dirname, "../../public/storage", filename);

//   try {
//     await fs.promises.unlink(filePath);
//     return true;
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       // File doesn't exist
//       return false;
//     }
//     throw error; // Re-throw other errors
//   }
// };

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
