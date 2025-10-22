const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
const { identifyWithAI, generateRecipe } = require("./gemini");

// ==================== FOR LOCAL DEVELOPMENT ====================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads");
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|webp/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
//   }
// });

// ==================== FOR VERCEL DEPLOYMENT ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "/tmp"; // Vercel's writable directory
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
  }
});
// ============================================================

// Helper function to clean up file
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️ Cleaned up file: ${filePath}`);
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err);
  }
}

// Helper function to handle Gemini 503 errors with retry
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      const is503 = error.message.includes("503") || error.message.includes("overloaded");
      
      if (is503 && i < maxRetries - 1) {
        console.log(`⚠️ Attempt ${i + 1} failed (503). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}

router.post("/upload", upload.single("image"), async (req, res) => {
  const uploadedFilePath = req.file?.path;
  console.log("📤 Uploaded file path:", uploadedFilePath);

  try {
    if (!uploadedFilePath) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Verify file exists
    try {
      await fs.access(uploadedFilePath);
    } catch {
      return res.status(400).json({ error: "Uploaded file not found" });
    }

    // Identify dish with retry logic
    const dishData = await retryOperation(
      () => identifyWithAI(uploadedFilePath, req.file.mimetype)
    );
    
    console.log("✅ Dish identified:", dishData);

    const dishName = dishData.dish;

    // Generate recipe with retry logic
    const recipeObj = await retryOperation(
      () => generateRecipe(dishName)
    );
    
    console.log("✅ Recipe generated:", recipeObj);

    // Clean up file after successful processing
    await cleanupFile(uploadedFilePath);

    return res.status(200).json({
      dish: dishName,
      recipe: recipeObj,
    });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    
    // Clean up file on error
    if (uploadedFilePath) {
      await cleanupFile(uploadedFilePath);
    }

    // Handle specific error types
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return res.status(503).json({
        error: "The AI service is currently overloaded. Please try again in a few moments.",
        retryAfter: 30
      });
    }

    if (error.message.includes("Could not identify")) {
      return res.status(404).json({
        error: "Could not identify the dish from the image. Please try a clearer photo.",
      });
    }

    res.status(500).json({
      error: "An error occurred while processing the image. Please try again.",
    });
  }
});

// Generate recipe by dish name
router.post("/generate", async (req, res) => {
  const { dishName } = req.body;

  if (!dishName || dishName.trim() === "") {
    return res.status(400).json({ error: "Dish name is required" });
  }

  try {
    const recipeObj = await retryOperation(
      () => generateRecipe(dishName.trim())
    );

    res.status(200).json({
      dish: dishName,
      recipe: recipeObj,
    });
  } catch (error) {
    console.error("❌ Error generating recipe:", error);

    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return res.status(503).json({
        error: "The AI service is currently overloaded. Please try again in a few moments.",
        retryAfter: 30
      });
    }

    res.status(500).json({
      error: "An error occurred while generating the recipe. Please try again.",
    });
  }
});

module.exports = router;