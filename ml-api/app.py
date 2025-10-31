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

app = Flask(__name__)
CORS(app)

# Optional: cap upload size (e.g., 20 MB)
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024

# Health check for Render
@app.get("/healthz")
def healthz():
    return {"status": "ok"}

# Load models
try:
    # Paths are relative to the service root (ml-api/)
    mri_model = tf.keras.models.load_model('alz_mri_model.keras')
    audio_model = joblib.load('audio_model.pkl')
    audio_scaler = joblib.load('audio_scaler.pkl')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    mri_model = audio_model = audio_scaler = None

@app.route("/analyze", methods=["POST"])
def analyze():
    print("\n--- Received a new analysis request ---")
    try:
        if mri_model is None or audio_model is None or audio_scaler is None:
            return jsonify({"error": "Models are not loaded on the server"}), 500

        if "mri" not in request.files or "voice" not in request.files:
            return jsonify({"error": "Missing MRI or voice file"}), 400

        mri_file = request.files["mri"]
        voice_file = request.files["voice"]
        quiz_score = float(request.form.get("quizScore", 0))

        print(f"🧠 Cognitive Quiz Score: {quiz_score}")

        # --- MRI ---
        print("🖼️  Processing MRI...")
        img = Image.open(io.BytesIO(mri_file.read())).convert("RGB").resize((128, 128))
        img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
        mri_pred = mri_model.predict(img_array, verbose=0)
        mri_score = float(np.max(mri_pred[0]) * 100)

        # --- Audio ---
        print("🎙️  Processing Audio...")
        try:
            audio, sr = sf.read(io.BytesIO(voice_file.read()))
        except Exception as e:
            print(f"⚠️ SoundFile failed ({e}), using Librosa fallback")
            voice_file.seek(0)
            audio, sr = librosa.load(io.BytesIO(voice_file.read()), sr=None)

        mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40).T, axis=0)
        scaled_features = audio_scaler.transform(mfccs.reshape(1, -1))
        audio_pred = audio_model.predict_proba(scaled_features)
        audio_score = float(audio_pred[0][1] * 100)

        # --- Combine ---
        overall_score = round((quiz_score * 0.2) + (mri_score * 0.6) + (audio_score * 0.2), 2)
        result = {
            "overall_score": overall_score,
            "cognitive": round(quiz_score, 2),
            "mri": round(mri_score, 2),
            "voice": round(audio_score, 2),
        }

        print(f"✅ Final Result: {result}")
        return jsonify({"status": "ok", "result": result})

    except Exception as e:
        print(f"❌ Critical error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# No __main__ block needed on Render (we use gunicorn)
