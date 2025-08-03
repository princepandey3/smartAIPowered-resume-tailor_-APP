import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import authroutes from "./routes/authroute.js";
import resumeRoutes from "./routes/resume.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import job from "./config/crone.js";

dotenv.config();

const app = express();

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

if (process.env.NODE_ENV === "production") job.start();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // Middleware to parse JSON bodies

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

initDB();

app.use("/api/auth", authroutes);
app.use("/api/resume", resumeRoutes); // Assuming you have a resumeRoutes defined

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("It is woringk ");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
