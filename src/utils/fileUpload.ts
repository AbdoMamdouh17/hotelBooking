import multer, { diskStorage, FileFilterCallback } from "multer";
import { Request } from "express";

export const fileUpload = () => {
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      return cb(
        new Error("Invalid file format. Only PNG and JPG are allowed.")
      );
    }
    cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};
