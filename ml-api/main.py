from fastapi import FastAPI, UploadFile, File
from PIL import Image
import numpy as np
import tensorflow as tf
import io

app = FastAPI()

from pathlib import Path
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "digit_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)


@app.get("/")
def home():
    return {
        "message": "ML API Running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    image = Image.open(
        io.BytesIO(await file.read())
    ).convert("L")

    image = image.resize((28, 28))

    image = np.array(image)

    image = image / 255.0

    image = image.reshape(1, 28, 28, 1)


    prediction = model.predict(image)

    digit = int(np.argmax(prediction))

    confidence = float(
        np.max(prediction) * 100
    )


    return {
        "digit": digit,
        "confidence": confidence
    }