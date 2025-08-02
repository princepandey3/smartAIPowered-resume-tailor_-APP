import pdf from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromFile = async (buffer, mimeType) => {
  try {
    if (mimeType === "application/pdf") {
      const data = await pdf(buffer);
      return data.text;
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("File parsing error:", error);
    throw new Error("Failed to extract text from file");
  }
};
