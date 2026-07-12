import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "https://handwritten-digit-recognition-2-9lcn.onrender.com/api/predictions"
      );

      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Prediction History</h1>

      <div className="card">

        <Link to="/">
          <button style={{ marginBottom: "20px" }}>
            ← Back to Home
          </button>
        </Link>

        {history.length === 0 ? (
          <p>No predictions found.</p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "15px",
                textAlign: "left"
              }}
            >
              <p><strong>Image:</strong> {item.image}</p>
              <p><strong>Digit:</strong> {item.digit}</p>
              <p><strong>Confidence:</strong> {item.confidence}%</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default History;