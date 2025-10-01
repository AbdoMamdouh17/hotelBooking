import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection";
import authRouter from "./modules/auth/auth.router";
dotenv.config();
const app = express();
//parse json data
app.use(express.json());
//connect to DataBase
await connectDB();
//routes
app.use("/auth", authRouter);
//page not found handler
app.all("*", (req, res, next) => {
    return next(new Error("Page Not Found"));
});
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: error.message,
        stcack: error.stack,
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` app listening on port ${port}!`));
//# sourceMappingURL=index.js.map