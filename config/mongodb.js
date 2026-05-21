import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("URI CHECK 👉", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set. Please check your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;