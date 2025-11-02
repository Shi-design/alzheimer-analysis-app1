# ml-api/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import joblib
import numpy as np
import librosa
from PIL import Image
import io
import soundfile as sf
import traceback
import os
import sys

app = Flask(__name__)

# Allow your Node backend and React dev server
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]}})

# Optional: cap upload size (~20 MB)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

# ---------- Load models ----------
# Use absolute paths relative to this file so it works anywhere
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def _p(*parts):
    return os.path.join(BASE_DIR, *parts)

mri_model = None
audio_model = None
audio_scaler = None

try:
    mri_model = tf.keras.models.load_model(_p("alz_mri_model.keras"))
    audio_model = joblib.load(_p("audio_model.pkl"))
    audio_scaler = joblib.load(_p("audio_scaler.pkl"))
    print("✅ Models loaded successfully.")
except Exception as e:
    print(f"❌ Error loading models: {e}", file=sys.stderr)

@app.post("/analyze")
def analyze():
    print("\n--- /analyze request ---")
    try:
        if mri_model is None or audio_model is None or audio_scaler is None:
            return jsonify({"error": "Models are not loaded on the server"}), 500

        if "mri" not in request.files or "voice" not in request.files:
            return jsonify({"error": "Missing MRI or voice file"}), 400

        mri_file = request.files["mri"]
        voice_file = request.files["voice"]
        quiz_score = float(request.form.get("quizScore", 0))

        print(f"🧠 quizScore = {quiz_score}")

        # ----- MRI -----
        print("🖼️  Processing MRI...")
        mri_bytes = mri_file.read()
        img = Image.open(io.BytesIO(mri_bytes)).convert("RGB").resize((128, 128))
        img_array = np.expand_dims(np.asarray(img, dtype=np.float32) / 255.0, axis=0)
        mri_pred = mri_model.predict(img_array, verbose=0)
        mri_score = float(np.max(mri_pred[0]) * 100.0)

        # ----- Audio -----
        print("🎙️  Processing audio...")
        voice_bytes = voice_file.read()

        # Try soundfile first (handles wav/flac/ogg, etc.)
        try:
            audio, sr = sf.read(io.BytesIO(voice_bytes))
        except Exception as e:
            print(f"⚠️  soundfile failed ({e}), trying librosa")
            audio, sr = librosa.load(io.BytesIO(voice_bytes), sr=None, mono=True)

        # MFCC features -> scale -> predict_proba
        mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40).T, axis=0)
        scaled = audio_scaler.transform(mfccs.reshape(1, -1))
        audio_pred = audio_model.predict_proba(scaled)
        audio_score = float(audio_pred[0][1] * 100.0)

        # ----- Combine -----
        overall_score = round((quiz_score * 0.20) + (mri_score * 0.60) + (audio_score * 0.20), 2)

        results = {
            "overall_score": overall_score,
            "cognitive": round(quiz_score, 2),
            "mri": round(mri_score, 2),
            "voice": round(audio_score, 2),
        }

        print(f"✅ results: {results}")
        # IMPORTANT: return key is 'results' to match your frontend check
        return jsonify({"status": "ok", "results": results})

    except Exception as e:
        print(f"❌ Critical error: {e}", file=sys.stderr)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Local dev entrypoint (Render uses gunicorn and ignores this block)
if __name__ == "__main__":
    # Port must match ML_API_URL in backend .env (http://localhost:8000)
    app.run(host="0.0.0.0", port=8000, debug=True)
