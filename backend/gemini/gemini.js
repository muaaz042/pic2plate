const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI("AIzaSyB0gwERkNOGpChmQ-EF7ZnEEp1Yt9yly1U");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/recipe", async (req, res) => {
  try {
    const { dishName } = req.body;

    if (!dishName) {
      return res.status(400).json({ error: "Dish name is required" });
    }

    // Construct the full prompt dynamically
    const prompt = `
      Provide a step-by-step recipe to prepare ${dishName}. Include:   
      1. A list of ingredients with quantities.  
      2. Detailed cooking instructions, broken down into clear, numbered steps.  
      3. Additional tips or variations if applicable.  

      Ensure the instructions are easy to follow and suitable for someone with basic cooking skills.
    `;

    const result = await model.generateContent(prompt);

    res.status(200).json({
      text: result.response.text(),
    });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

module.exports = router;
