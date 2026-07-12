const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const predictionRoutes = require("./routes/predictionRoutes");


const app = express();


app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log("MongoDB Error:", error);
});


// Routes
app.use("/api/predictions", predictionRoutes);


// Test Route
app.get("/", (req, res) => {
    res.send("Backend Running");
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});