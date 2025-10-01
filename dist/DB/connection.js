import mongoose from "mongoose";
export const connectDB = async () => {
    return await mongoose
        .connect(process.env.CONNECTION_URL)
        .then(() => {
        console.log("Database connected");
    })
        .catch(() => {
        console.log(" failed to connect Database  ");
    });
};
//# sourceMappingURL=connection.js.map