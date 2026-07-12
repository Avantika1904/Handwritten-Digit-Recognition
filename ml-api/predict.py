import sys
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

from pathlib import Path
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "digit_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)


image_path = sys.argv[1]


# Same preprocessing as training
img = load_img(
    image_path,
    target_size=(28,28),
    color_mode="grayscale"
)


img = img_to_array(img)

img = img / 255.0


img = np.expand_dims(
    img,
    axis=0
)


prediction = model.predict(
    img,
    verbose=0
)


digit = np.argmax(prediction)

confidence = np.max(prediction)


print("Predicted Digit:", digit)
print(f"Confidence: {confidence*100:.2f}%")