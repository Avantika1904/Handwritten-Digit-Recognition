const express = require("express");
const multer = require("multer");
const { PythonShell } = require("python-shell");
const path = require("path");
const Prediction = require("../models/Prediction");

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Upload & Predict
router.post("/upload", upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No image uploaded"
        });
    }

    // Full path of uploaded image
    const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        req.file.filename
    );

    const options = {
        mode: "text",
        pythonPath: "python",
        scriptPath: path.join(__dirname, "..", "..", "Model"),
        args: [imagePath]
    };

    try {

        const results = await PythonShell.run("predict.py", options);

        // Example:
        // results[0] = "Predicted Digit: 8"
        // results[1] = "Confidence: 49.03%"

        const digit = parseInt(results[0].split(":")[1].trim());

        const confidence = parseFloat(
            results[1].split(":")[1].replace("%", "").trim()
        );

        // Save to MongoDB
        const prediction = new Prediction({
            image: req.file.filename,
            digit,
            confidence
        });

        await prediction.save();

        res.json({
            message: "Prediction Successful",
            prediction
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Prediction Failed",
            error: err.message
        });

    }

});

// Get all prediction history
router.get("/", async (req, res) => {

    try {

        const predictions = await Prediction.find()
            .sort({ createdAt: -1 });

        res.json(predictions);

    } catch (err) {

        res.status(500).json({
            message: "Error fetching predictions"
        });

    }

});

module.exports = router;