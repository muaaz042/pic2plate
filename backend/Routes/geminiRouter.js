const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
const { identifyWithAI, generateRecipe } = require("./gemini");

// const identifyWithAI = require("../Gemini/identifyDishBYGemini");
// const generateRecipe = require("../Gemini/recipeGenerator");

// Configure Multer with diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Add timestamp to filename
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Route to upload and process an image and generate recipe
router.post("/upload", upload.single("image"), async (req, res) => {
  const uploadedFilePath = req.file?.path;
  console.log("Uploaded file path try 1:", uploadedFilePath);
  try {
    if (!uploadedFilePath) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    let dishName = await identifyWithCustomModel(uploadedFilePath);
    if (!dishName) {
      dishName = await identifyWithAI(uploadedFilePath, "image/jpeg");
      console.log("Dish identified:", dishName);
    }

    if (dishName) {
      const recipe = await generateRecipe(dishName);
      console.log("Recipe generated:", recipe);
      await fs.unlink(uploadedFilePath);
      return res.status(200).json({
        dish: dishName,
        recipe: JSON.parse(recipe),
      });
    }

    // If no dish is identified
    await fs.unlink(uploadedFilePath);
    return res.status(404).json({
      dish: null,
      recipe: null,
      error: "Dish could not be identified",
    });
  } catch (error) {
    console.error(error);
    if (uploadedFilePath) {
      console.log("Deleting uploaded file...", uploadedFilePath);
      await fs.unlink(uploadedFilePath);
    }
    console.error("Error processing image:", error);
    res.status(500).json({
      error: "An error occurred while processing the image",
    });
  }
});
//by disname
router.post("/generate", async (req, res) => {
  const {dishName} = req.body;
  try {
    const recipe = await generateRecipe(dishName);
    console.log("Recipe generated:", recipe);
    const recipeObj = JSON.parse(recipe);
    res.status(200).json({
      dish: dishName,
      recipe: recipeObj,
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({
      error: "An error occurred while generating the recipe",
    });
  }
}
);

// Mock custom model identification function
async function identifyWithCustomModel(imagePath) {
  // Here, call your Kaggle model (e.g., via Python script or API)
  // Return null if the dish is not identified
  return null; // Replace with actual logic
}

module.exports = router;
