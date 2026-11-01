import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose>;
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("✅ DB Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ DB Connection Failed:", error);
        globalForMongoose.mongoosePromise = undefined;
        throw error;
      });
  }

  return globalForMongoose.mongoosePromise;
};

export default connectDB;
