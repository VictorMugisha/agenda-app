import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import protectedRoute from "./middlewares/protect.middleware.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", protectedRoute, userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
