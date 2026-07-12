const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const Prediction = require("../models/Prediction");

const router = express.Router();


// Upload folder
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Multer storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});


const upload = multer({ storage });


// Upload & Predict
router.post("/upload", upload.single("image"), async (req, res) => {


    if (!req.file) {
        return res.status(400).json({
            message: "No image uploaded"
        });
    }


    try {

        const imagePath = path.join(
            uploadDir,
            req.file.filename
        );


        // Send image to FastAPI ML service
        const formData = new FormData();

        formData.append(
            "file",
            fs.createReadStream(imagePath)
        );


        const response = await axios.post(
            "https://handwritten-digit-recognition-1-2rn5.onrender.com/predict",
            formData,
            {
                headers: formData.getHeaders()
            }
        );
        console.log("ML Response:", response.data);


        const digit = response.data.digit;

        const confidence = response.data.confidence;


        // Save prediction
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


    } catch (error) {

    console.error("FULL ERROR:");
    console.error(error);

    res.status(500).json({
        message: "Prediction Failed",
        error: error.message
    });

}

});



// History
router.get("/", async (req, res) => {

    try {

        const predictions = await Prediction
            .find()
            .sort({
                createdAt: -1
            });


        res.json(predictions);


    } catch (error) {

        res.status(500).json({
            message: "Error fetching predictions"
        });

    }

});


module.exports = router;