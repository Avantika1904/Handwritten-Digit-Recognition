import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Home() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await axios.post(
        "https://handwritten-digit-recognition-vrvq.onrender.com/api/predictions/upload",
        formData
      );

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Handwritten Digit Recognition</h1>

      <div className="card">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {image && (
          <div className="preview">
            <h3>Selected Image</h3>

            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
            />
          </div>
        )}

        <button onClick={handlePredict}>
          {loading ? "Predicting..." : "Predict Digit"}
        </button>

        <Link to="/history">
          <button
            style={{
              marginTop: "15px",
              backgroundColor: "#28a745",
            }}
          >
            View History
          </button>
        </Link>

        {prediction && (
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            <h2>Prediction Result</h2>

            <h1
              style={{
                fontSize: "60px",
                color: "#007bff",
                margin: "15px 0",
              }}
            >
              {prediction.digit}
            </h1>

            <p
              style={{
                fontSize: "18px",
              }}
            >
              <strong>Confidence:</strong>{" "}
              {prediction.confidence.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;