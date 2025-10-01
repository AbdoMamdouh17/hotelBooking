import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import roomRouter from "./modules/room/room.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
dotenv.config();
const app = express();

// CORS

// const whitelist = ["http://127.0.0.1:3000", "http://127.0.0.1:3000"];
// app.use((req: Request, res: Response, next: NextFunction) => {
//   if (!whitelist.includes(req.headers.origin || "")) {
//     return next(new Error("Blocked by Cors"));
//   }
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Private-Network", "true");
//   res.setHeader("Access-Control-Allow-Credentials", "true"); // لو هتستخدم كوكيز
//   next();
// });

//parse json data
app.use(express.json());
//parse cookies
app.use(cookieParser());
//connect to DataBase
await connectDB();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

//routes
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/reservation", reservationRouter);
//page not found handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new Error("Page Not Found"));
});

//global error handler
// نعمل interface عشان نزود الـ statusCode
interface AppError extends Error {
  statusCode?: number;
}

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(` app listening on port ${port}!`));
