from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import joblib
import numpy as np
import librosa
from PIL import Image
import io

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# --- Load All Models and Scalers at Startup ---
try:
    # Load the Keras model for MRI using the new format
    mri_model = tf.keras.models.load_model('alz_mri_model.keras')
    
    # Load the joblib models and scalers for Audio
    audio_model = joblib.load('audio_model.pkl')
    audio_scaler = joblib.load('audio_scaler.pkl')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")

# --- MRI Prediction Endpoint ---
@app.route('/predict_mri', methods=['POST'])
def predict_mri():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    try:
        # Preprocess the image to match the training conditions
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        img = img.resize((128, 128))  # Must match the target_size from your notebook
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Create a batch of 1
        
        # Make a prediction
        prediction = mri_model.predict(img_array)
        
        # Extract the highest probability score from the prediction
        predicted_probability = float(np.max(prediction[0]))

        return jsonify({'mri_prediction': predicted_probability})
    except Exception as e:
        return jsonify({'error': f"Error during MRI prediction: {str(e)}"}), 500

# --- Audio Prediction Endpoint ---
@app.route('/predict_audio', methods=['POST'])
def predict_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
        
    file = request.files['file']
    
    try:
        # Extract audio features using librosa
        audio, sample_rate = librosa.load(file, sr=None)
        mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40).T, axis=0)
        
        # Reshape and scale the features just like in training
        features_reshaped = mfccs.reshape(1, -1)
        features_scaled = audio_scaler.transform(features_reshaped)
        
        # Make a prediction
        prediction = audio_model.predict_proba(features_scaled)
        
        # Return the probability of the "positive" class (usually index 1)
        return jsonify({'audio_prediction': float(prediction[0][1])})
    except Exception as e:
        return jsonify({'error': f"Error during audio prediction: {str(e)}"}), 500

# --- Main execution block ---
if __name__ == '__main__':
    # Run the Flask API server on port 5001
    app.run(debug=True, port=5001)