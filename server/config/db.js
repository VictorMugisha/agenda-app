import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const mongoDBConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${mongoDBConnection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
}
