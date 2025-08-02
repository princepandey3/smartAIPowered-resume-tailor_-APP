import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default async function analyzeResumeForATS(resumeText, jobDescription) {
  try {
    const prompt = `
You are an expert in resume analysis and optimization for ATS (Applicant Tracking Systems).

Below is a candidate's resume:
==============================
${resumeText}

Below is the job description:
=============================
${jobDescription}

Please perform the following tasks:
1. Provide an ATS match score from 0 to 100.
2. List the resume's strengths.
3. List the resume's weaknesses.
4. Suggest improvements to better match the job.
5. Identify important missing keywords or skills from the job description.
6.Provide the percentage of keywords from the job description that are present in the resume.

Return your response in the following JSON format:
{
  "atsScore": number,
  "strengths": [string],
  "weaknesses": [string],
  "improvementSuggestions": [string],
  "keywordMatchPercentage": number,
  "missingKeywords": [string]
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Try parsing the JSON part from the output
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error("ATS analysis failed:", error.message);
    throw new Error("Failed to analyze resume for ATS");
  }
}

//export default analyzeResumeForATS;
