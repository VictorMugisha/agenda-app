import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.route.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
