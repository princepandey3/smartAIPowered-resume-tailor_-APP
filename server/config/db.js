import mongoose from "mongoose";

export const initDB = async () => {
  try {
    await mongoose.connect(process.env.DaTABASE_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1); // Exit the process with failure
  }
};
