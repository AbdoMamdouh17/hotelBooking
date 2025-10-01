import { IRoom, Room } from "../../DB/models/room.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Request, Response, NextFunction, query } from "express";
import cloudinary from "../../utils/cloud.js";

export const createRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, price, type, description } = req.body;
    // check file
    if (!req.files || req.files.length === 0)
      return next(new Error("Images are required", { cause: 400 }));

    const files = req.files as Express.Multer.File[];
    //upload images in cloudinary
    const images: { id: string; url: string }[] = [];

    for (let file of files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/rooms`,
        }
      );
      images.push({ id: public_id, url: secure_url });
    }
    // create room
    const room = await Room.create({
      roomId,
      type,
      price,
      description,
      images,
    });
    // send response
    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  }
);
// get all room
export const getAllRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sort, page, keyword, ...filters } = req.query;

    let filter: any = { ...filters };

    filter = JSON.parse(
      JSON.stringify(filter).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );

    if (req.user?.role !== "admin") {
      filter.isAvailable = true;
    }
    // نبحث بدول
    const searchableFields = ["roomId", "type", "description", "price"];

    // 4️⃣ search
    if (keyword) {
      filter.$or = searchableFields.map((field) => ({
        [field]: { $regex: keyword, $options: "i" },
      }));
    }
    const options: any = {
      limit: 2, // هنا انت اللي تحدده
    };
    if (page) options.page = Number(page);
    if (sort) options.sort = sort;

    // 6️⃣ تنفيذ paginate لكل المستخدمين
    const rooms = await Room.paginate(filter, options);

    res.json({
      success: true,
      rooms,
    });
  }
);

//update room
export const updateRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      price,
      type,
      isAvailable,
      description,
      removeImages = [],
    } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return next(new Error("room not found"));
    // احذف الصوره من cloudinary
    for (const imgId of removeImages) {
      await cloudinary.uploader.destroy(imgId);
      // احذف الصوره من ال db
      room.images = room.images.filter((img) => img.id != imgId);
    }

    //check file
    // check files
    const files = req.files as Express.Multer.File[];
    const newImages: { id: string; url: string }[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: process.env.CLOUD_FOLDER_NAME || "rooms" }
        );

        newImages.push({ id: public_id, url: secure_url });
      }
      room.images.push(...newImages);
    }
    // 4. تحديث باقي البيانات
    const allowedFields: (keyof IRoom)[] = [
      "roomId",
      "type",
      "price",
      "description",
      "isAvailable",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (room as any)[field] = req.body[field];
      }
    }

    await room.save();

    return res.json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  }
);
