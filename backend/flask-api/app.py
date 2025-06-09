from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json

app = Flask(__name__)
CORS(app)  # Enable CORS untuk komunikasi dengan Node.js

# Load model saat startup
print("Loading TensorFlow model...")
try:
    model = tf.keras.models.load_model('my_model.keras')
    print("Model loaded successfully!")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_input(data):
    """
    Preprocessing data untuk model prediction
    Sesuaikan dengan format yang diharapkan model Anda
    """
    try:
        # Mapping categorical values to numerical
        motivation_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
        teacher_quality_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
        gender_mapping = {'Male': 1, 'Female': 0}
        
        # Extract dan convert features
        features = [
            float(data.get('hoursStudied', 0)),
            float(data.get('attendance', 0)),
            int(data.get('extracurricularActivities', False)),
            float(data.get('sleepHours', 7)),
            float(data.get('previousScores', 0)),
            motivation_mapping.get(data.get('motivationLevel', 'Medium'), 1),
            float(data.get('tutoringSessions', 0)),
            teacher_quality_mapping.get(data.get('teacherQuality', 'Medium'), 1),
            float(data.get('physicalActivity', 0)),
            int(data.get('learningDisabilities', False)),
            gender_mapping.get(data.get('gender', 'Male'), 1)
        ]
        
        return np.array(features).reshape(1, -1)
    
    except Exception as e:
        raise ValueError(f"Error preprocessing input: {str(e)}")

def get_prediction_category(score):
    """Determine prediction category based on score"""
    if score <= 40:
        return 'Gagal'
    elif score <= 74:
        return 'Cukup'
    else:
        return 'Berhasil'

def get_prediction_status(score):
    """Determine prediction status based on score"""
    if score <= 40:
        return 'fail'
    elif score <= 74:
        return 'at_risk'
    else:
        return 'success'

def generate_intervention_recommendations(data, prediction_status):
    """Generate intervention recommendations based on input data and prediction"""
    recommendations = []
    
    if float(data.get('hoursStudied', 0)) < 3:
        recommendations.append("Tingkatkan waktu belajar menjadi minimal 3-4 jam per hari")
    
    if float(data.get('attendance', 0)) < 80:
        recommendations.append("Perbaiki kehadiran di kelas, target minimal 80%")
    
    if float(data.get('sleepHours', 7)) < 6:
        recommendations.append("Pastikan tidur yang cukup, minimal 7-8 jam per malam")
    
    if data.get('motivationLevel') == 'Low':
        recommendations.append("Cari sumber motivasi belajar, bergabung dengan grup belajar")
    
    if float(data.get('tutoringSessions', 0)) == 0 and prediction_status in ['fail', 'at_risk']:
        recommendations.append("Pertimbangkan mengikuti sesi tutoring tambahan")
    
    if float(data.get('physicalActivity', 0)) < 1:
        recommendations.append("Tambahkan aktivitas fisik untuk meningkatkan konsentrasi")
    
    if data.get('learningDisabilities'):
        recommendations.append("Konsultasi dengan konselor akademik untuk strategi belajar khusus")
    
    if len(recommendations) == 0:
        recommendations.append("Pertahankan performa belajar yang baik")
    
    return recommendations

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'Flask ML API is running'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    if model is None:
        return jsonify({
            'success': False,
            'error': 'Model not loaded'
        }), 500
    
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No input data provided'
            }), 400
        
        print(f"Received data: {data}")
        
        # Preprocess input data
        input_array = preprocess_input(data)
        
        print(f"Preprocessed input shape: {input_array.shape}")
        print(f"Preprocessed input: {input_array}")
        
        # Make prediction
        prediction = model.predict(input_array, verbose=0)
        prediction_score = float(prediction[0][0])
        
        # Ensure score is in 0-100 range
        if prediction_score > 1:
            prediction_score = min(prediction_score, 100)
        else:
            prediction_score = prediction_score * 100
        
        prediction_score = round(prediction_score, 2)
        
        # Get prediction status and category
        prediction_status = get_prediction_status(prediction_score)
        prediction_category = get_prediction_category(prediction_score)
        
        # Generate intervention recommendations
        intervention_recommendations = generate_intervention_recommendations(data, prediction_status)
        
        # Prepare response
        result = {
            'success': True,
            'predictionScore': prediction_score,
            'predictionStatus': prediction_status,
            'predictionCategory': prediction_category,
            'interventionRecommendations': intervention_recommendations,
            'modelUsed': 'TensorFlow Neural Network',
            'probabilities': {
                'success': round((prediction_score / 100) if prediction_score > 74 else 0, 3),
                'at_risk': round((prediction_score / 100) if 40 < prediction_score <= 74 else 0, 3),
                'fail': round((1 - prediction_score / 100) if prediction_score <= 40 else 0, 3)
            }
        }
        
        print(f"Prediction result: {result}")
        return jsonify(result)
        
    except ValueError as ve:
        print(f"Validation error: {ve}")
        return jsonify({
            'success': False,
            'error': str(ve)
        }), 400
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            'success': False,
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({
            'success': False,
            'error': 'Model not loaded'
        }), 500
    
    try:
        return jsonify({
            'success': True,
            'input_shape': str(model.input_shape),
            'output_shape': str(model.output_shape),
            'model_layers': len(model.layers),
            'model_summary': 'TensorFlow/Keras Neural Network Model'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Student Performance Prediction ML API',
        'status': 'running',
        'model_loaded': model is not None,
        'endpoints': ['/health', '/predict', '/model-info']
    })

if __name__ == '__main__':
    print("Starting Flask ML API server...")
    print("Available endpoints:")
    print("- GET  /health - Health check")
    print("- POST /predict - Make predictions")
    print("- GET  /model-info - Model information")
    app.run(host='0.0.0.0', port=5000, debug=True)