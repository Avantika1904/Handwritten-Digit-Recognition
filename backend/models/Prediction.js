const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    digit: {
        type: Number,
        required: true
    },

    confidence: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Prediction", predictionSchema);