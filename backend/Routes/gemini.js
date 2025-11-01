const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  // thinkingBudget: 0,
  maxOutputTokens: 1024,
  responseMimeType: "application/json",
};

async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path.split(/[/\\]/).pop(), // Handle both Unix and Windows paths
    });

    return uploadResult.file;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
}

async function identifyWithAI(filePath, mimeType) {
  try {
    const uploadedFile = await uploadToGemini(filePath, mimeType);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            },
            {
  text: `You are a chef. Identify the dish in the image and return only JSON:
  {"dish": "exact dish name"} 
  If unsure, return {"dish": "Unknown"}.`
},

          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Identify the dish.");
    
    if (!result || !result.response) {
      throw new Error("No response from Gemini model");
    }

    const text = result.response.text();
    console.log("📥 Dish Identification Response:", text);

    // Parse and validate response
    const parsed = JSON.parse(text);
    
    if (!parsed.dish || parsed.dish === "Unknown") {
      throw new Error("Could not identify dish from image");
    }

    return parsed;
  } catch (error) {
    console.error("Error during AI processing:", error);
    // Re-throw with more context
    throw new Error(`AI identification failed: ${error.message}`);
  }
}

async function generateRecipe(dishName) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are a professional chef. 
                Given the dish name "${dishName}", generate a JSON object with the following structure:
                {
                  "title": "Dish name here",
                  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
                  "method": ["Step 1", "Step 2", "Step 3"],
                  "tips": ["Tip 1", "Tip 2"]
                }

                ⚠️ Return ONLY valid JSON. Do not include explanations, markdown formatting, or code blocks.`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(dishName);

    if (!result || !result.response) {
      throw new Error("No response from Gemini model");
    }

    const text = result.response.text();
    console.log("📥 Recipe Generation Response:", text);

    // Validate it's valid JSON
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("❌ Error generating dish details:", error);
    throw new Error(`Recipe generation failed: ${error.message}`);
  }
}

module.exports = {
  generateRecipe,
  identifyWithAI, 
};  