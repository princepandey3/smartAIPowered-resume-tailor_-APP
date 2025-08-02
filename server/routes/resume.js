//resumerotes.js
import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/userauth.js";
import { extractTextFromFile } from "../services/fileParser.js";
import Resume from "../model/resume.js";
import analyzeResumeForATS from "../services/atsAnalyzer.js";

const router = express.Router();

// Configure multer to use memory storage instead of saving files to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
  },
});

// POST /api/resume/upload
router.post(
  "/upload",
  authenticate,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { jobDescription } = req.body;
      if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required" });
      }

      // Extract text directly from memory buffer
      const extractedText = await extractTextFromFile(
        req.file.buffer,
        req.file.mimetype
      );

      // Save resume details and extracted text to MongoDB
      const resume = new Resume({
        userId: req.user._id,
        originalFileName: req.file.originalname,
        fileType: req.file.mimetype === "application/pdf" ? "pdf" : "docx",
        extractedText,
        jobDescription,
        processingStatus: "processing",
      });

      await resume.save();

      // Async ATS analysis
      // Analyze and update the resume with ATS data
      try {
        const atsResult = await analyzeResumeForATS(
          extractedText,
          jobDescription
        );

        await Resume.findByIdAndUpdate(resume._id, {
          atsScore: atsResult.atsScore,
          strengths: atsResult.strengths,
          weaknesses: atsResult.weaknesses,
          improvementSuggestions: atsResult.improvementSuggestions,
          keywordMatchPercentage: atsResult.keywordMatchPercentage,
          missingKeywords: atsResult.missingKeywords,

          processingStatus: "completed",
        });
        res.status(200).json({
          message: "Resume uploaded and analyzed successfully",
          atsResult,
        });
      } catch (err) {
        console.error("ATS analysis failed:", err);
        await Resume.findByIdAndUpdate(resume._id, {
          processingStatus: "failed",
          errorMessage: err.message,
        });
      }

      //   res.json({
      //     message: "Resume uploaded successfully",
      //     resumeId: resume._id,
      //     extractedText,

      //     status: "processing",
      //   });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Server error during upload" });
    }
  }
);

export default router;
