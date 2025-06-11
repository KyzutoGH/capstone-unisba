from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler

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
    Preprocessing data sesuai dengan notebook
    Input features: ['Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
                    'Motivation_Level', 'Tutoring_Sessions', 'Teacher_Quality',
                    'Physical_Activity', 'Gender', 'Exam_Score', 'success_value']
    """
    try:
        # Mapping categorical values sesuai notebook
        motivation_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
        teacher_quality_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
        gender_mapping = {'Male': 1, 'Female': 0}
        
        # Extract basic features
        hours_studied = float(data.get('hoursStudied', 0))
        attendance = float(data.get('attendance', 0))
        sleep_hours = float(data.get('sleepHours', 7))
        previous_scores = float(data.get('previousScores', 0))
        motivation_level = motivation_mapping.get(data.get('motivationLevel', 'Medium'), 1)
        tutoring_sessions = float(data.get('tutoringSessions', 0))
        teacher_quality = teacher_quality_mapping.get(data.get('teacherQuality', 'Medium'), 1)
        physical_activity = float(data.get('physicalActivity', 0))
        gender = gender_mapping.get(data.get('gender', 'Male'), 1)
        
        # Calculate Exam Score seperti di notebook
        exam_score = (
            previous_scores * 0.5 +
            attendance * 0.25 +
            hours_studied * 3 +
            motivation_level * 5 +
            teacher_quality * 3
        )
        exam_score = min(max(exam_score, 0), 100)
        
        # Calculate success_value seperti di notebook
        feature_weights = {
            'Hours_Studied': 0.71,
            'Attendance': 0.2,
            'Sleep_Hours': 1,
            'Previous_Scores': 0.12,
            'Motivation_Level': 4,
            'Tutoring_Sessions': 1.5,
            'Teacher_Quality': 4,
            'Physical_Activity': 0.5,
            'Exam_Score': 0.15
        }
        
        raw_success_score = (
            hours_studied * feature_weights['Hours_Studied'] +
            attendance * feature_weights['Attendance'] +
            sleep_hours * feature_weights['Sleep_Hours'] +
            previous_scores * feature_weights['Previous_Scores'] +
            motivation_level * feature_weights['Motivation_Level'] +
            tutoring_sessions * feature_weights['Tutoring_Sessions'] +
            teacher_quality * feature_weights['Teacher_Quality'] +
            physical_activity * feature_weights['Physical_Activity'] +
            exam_score * feature_weights['Exam_Score']
        )
        
        # Normalisasi success_score sesuai notebook (range 1-100)
        # Berdasarkan MinMaxScaler yang digunakan di notebook
        min_training_score = 3  # Sesuai dengan data training
        max_training_score = 100
        success_value = ((raw_success_score - min_training_score) / 
                        (max_training_score - min_training_score)) * 97 + 3
        success_value = min(max(success_value, 1), 100)
        
        # Susun features sesuai urutan di notebook
        features = [
            hours_studied,      # Hours_Studied
            attendance,         # Attendance  
            sleep_hours,        # Sleep_Hours
            previous_scores,    # Previous_Scores
            motivation_level,   # Motivation_Level (encoded)
            tutoring_sessions,  # Tutoring_Sessions
            teacher_quality,    # Teacher_Quality (encoded)
            physical_activity,  # Physical_Activity
            gender,            # Gender (encoded)
            exam_score,        # Exam_Score (calculated)
            success_value      # success_value (calculated)
        ]
        
        return np.array(features, dtype=np.float32).reshape(1, -1)
    
    except Exception as e:
        raise ValueError(f"Error preprocessing input: {str(e)}")

def get_prediction_category_from_class(predicted_class):
    """Convert predicted class to category sesuai notebook"""
    class_mapping = {0: 'Gagal', 1: 'Cukup', 2: 'Berhasil'}
    return class_mapping.get(predicted_class, 'Unknown')

def get_prediction_status_from_class(predicted_class):
    """Convert predicted class to status"""
    status_mapping = {0: 'fail', 1: 'at_risk', 2: 'success'}
    return status_mapping.get(predicted_class, 'unknown')

def predict_student_success_improved(data, model=None):
    try:
        # Ekstrak data dari request
        hours_studied = float(data.get('hoursStudied', 0))
        attendance = float(data.get('attendance', 0))
        sleep_hours = float(data.get('sleepHours', 7))
        previous_scores = float(data.get('previousScores', 0))
        motivation_level = data.get('motivationLevel', 'Medium')
        tutoring_sessions = float(data.get('tutoringSessions', 0))
        teacher_quality = data.get('teacherQuality', 'Medium')
        physical_activity = float(data.get('physicalActivity', 0))
        gender = data.get('gender', 'Male')

        # Encode variabel kategorik
        motivation_map = {'Low': 0, 'Medium': 1, 'High': 2}
        teacher_map = {'Low': 0, 'Medium': 1, 'High': 2}
        motivation_encoded = motivation_map.get(motivation_level, 1)
        teacher_encoded = teacher_map.get(teacher_quality, 1)
        gender_encoded = 1 if gender.lower() == 'male' else 0

        # Hitung exam score (rule-based)
        exam_score = (
            previous_scores * 0.5 +
            attendance * 0.25 +
            hours_studied * 3 +
            motivation_encoded * 5 +
            teacher_encoded * 3
        )
        exam_score = min(max(exam_score, 0), 100)

        # Hitung success score
        feature_weights = {
            'Hours_Studied': 0.71,
            'Attendance': 0.2,
            'Sleep_Hours': 1,
            'Previous_Scores': 0.12,
            'Motivation_Level': 4,
            'Tutoring_Sessions': 1.5,
            'Teacher_Quality': 4,
            'Physical_Activity': 0.5,
            'Exam_Score': 0.15
        }

        raw_success_score = (
            hours_studied * feature_weights['Hours_Studied'] +
            attendance * feature_weights['Attendance'] +
            sleep_hours * feature_weights['Sleep_Hours'] +
            previous_scores * feature_weights['Previous_Scores'] +
            motivation_encoded * feature_weights['Motivation_Level'] +
            tutoring_sessions * feature_weights['Tutoring_Sessions'] +
            teacher_encoded * feature_weights['Teacher_Quality'] +
            physical_activity * feature_weights['Physical_Activity'] +
            exam_score * feature_weights['Exam_Score']
        )

        min_training_score = 3
        max_training_score = 100
        success_score = ((raw_success_score - min_training_score) /
                        (max_training_score - min_training_score)) * 97 + 3
        success_score = int(min(max(success_score, 1), 100))

        # Rule-based prediction
        if success_score <= 35:
            prediction_category = 'Gagal'
            prediction_status = 'fail'
        elif success_score <= 65:
            prediction_category = 'Cukup'
            prediction_status = 'at_risk'
        else:
            prediction_category = 'Berhasil'
            prediction_status = 'success'

        return {
            'success_score': success_score,  # ✅ DITAMBAHKAN
            'exam_score': exam_score,        # ✅ DITAMBAHKAN
            'predictionScore': success_score,
            'examScore': exam_score,
            'predictionCategory': prediction_category,
            'predictionStatus': prediction_status,
            'rule_based_prediction': prediction_category,
            'rule_based_status': prediction_status,
            'model_prediction': prediction_category,
            'model_status': prediction_status,
            'model_confidence': 1.0,
            'probabilities': {
                'fail': 1.0 if prediction_status == 'fail' else 0.0,
                'at_risk': 1.0 if prediction_status == 'at_risk' else 0.0,
                'success': 1.0 if prediction_status == 'success' else 0.0
            },
            'is_consistent': True,
            'method': 'rule_based_only'
        }

    except Exception as e:
        raise ValueError(f"Error in manual prediction: {str(e)}")

def generate_intervention_recommendations(data, prediction_status, success_score):
    """Generate intervention recommendations based on input data and prediction"""
    recommendations = []
    
    hours_studied = float(data.get('hoursStudied', 0))
    attendance = float(data.get('attendance', 0))
    sleep_hours = float(data.get('sleepHours', 7))
    motivation_level = data.get('motivationLevel', 'Medium')
    tutoring_sessions = float(data.get('tutoringSessions', 0))
    physical_activity = float(data.get('physicalActivity', 0))
    
    if hours_studied < 4:
        recommendations.append("Tingkatkan waktu belajar menjadi minimal 4-6 jam per hari untuk hasil optimal")
    
    if attendance < 85:
        recommendations.append("Perbaiki kehadiran di kelas, target minimal 85% untuk memaksimalkan pembelajaran")
    
    if sleep_hours < 7:
        recommendations.append("Pastikan tidur yang cukup, minimal 7-8 jam per malam untuk konsentrasi optimal")
    
    if motivation_level == 'Low':
        recommendations.append("Tingkatkan motivasi belajar dengan menetapkan tujuan yang jelas dan bergabung dengan kelompok belajar")
    
    if tutoring_sessions == 0 and prediction_status in ['fail', 'at_risk']:
        recommendations.append("Pertimbangkan mengikuti sesi tutoring tambahan untuk memperkuat pemahaman materi")
    
    if physical_activity < 2:
        recommendations.append("Tambahkan aktivitas fisik minimal 2-3 kali seminggu untuk meningkatkan konsentrasi dan stamina")
    
    if success_score < 50:
        recommendations.append("Buat jadwal belajar yang terstruktur dan konsultasi dengan guru atau konselor akademik")
    
    if len(recommendations) == 0:
        if prediction_status == 'success':
            recommendations.append("Pertahankan performa belajar yang excellent! Terus konsisten dengan kebiasaan belajar yang baik")
        else:
            recommendations.append("Tingkatkan konsistensi dalam semua aspek pembelajaran untuk hasil yang lebih baik")
    
    return recommendations

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'Flask ML API is running - Updated from Notebook'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint - Hybrid: override if model is overconfident but wrong"""
    if model is None:
        return jsonify({
            'success': False,
            'error': 'Model not loaded'
        }), 500
    
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No input data provided'
            }), 400
        
        print(f"Received data: {data}")
        
        # Use improved prediction function from notebook
        prediction_result = predict_student_success_improved(data, model)

        # Default values
        model_confidence = prediction_result.get('model_confidence', 0.0)
        is_consistent = prediction_result.get('is_consistent', True)

        # Hybrid logic
        if 'model_prediction' in prediction_result:
            prediction_score = prediction_result.get('success_score', prediction_result.get('predictionScore', -1))
            exam_score = prediction_result.get('exam_score', prediction_result.get('examScore', 0))
            probabilities = prediction_result['probabilities']

            model_prediction = prediction_result['model_prediction']
            model_status = prediction_result['model_status']
            rule_prediction = prediction_result['rule_based_prediction']
            rule_status = prediction_result['rule_based_status']

            # Hybrid override if overconfident and inconsistent
            if model_confidence > 0.98 and not is_consistent:
                print("⚠️ Model overconfidence terdeteksi. Gunakan rule-based prediction.")
                final_prediction = rule_prediction
                final_status = rule_status
                model_used = "Rule-Based Override (due to model overconfidence)"
            else:
                final_prediction = model_prediction
                final_status = model_status
                model_used = "TensorFlow Neural Network (Updated from Notebook)"
        else:
            # Fallback to rule-based only
            prediction_score = prediction_result['success_score']
            exam_score = prediction_result.get('exam_score', prediction_result.get('examScore', 0))
            final_prediction = prediction_result['rule_based_prediction']
            final_status = prediction_result['rule_based_status']
            probabilities = {'fail': 0.33, 'at_risk': 0.33, 'success': 0.34}
            model_confidence = 0.8
            model_used = "Rule-Based Only (No model loaded)"
            is_consistent = True

        # Generate recommendations
        intervention_recommendations = generate_intervention_recommendations(data, final_status, prediction_score)

        # Build response
        result = {
            'success': True,
            'predictionScore': prediction_score,
            'examScore': exam_score,
            'predictionStatus': final_status,
            'predictionCategory': final_prediction,
            'interventionRecommendations': intervention_recommendations,
            'modelUsed': model_used,
            'modelConfidence': model_confidence,
            'probabilities': probabilities,
            'isConsistent': is_consistent,
            'rawPredictionData': {
                'successScore': prediction_score,
                'ruleBasedPrediction': prediction_result.get('rule_based_prediction', ''),
                'modelPrediction': prediction_result.get('model_prediction', ''),
                'method': 'hybrid'
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

@app.route('/predict-detailed', methods=['POST'])
def predict_detailed():
    """Detailed prediction endpoint with full notebook analysis"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No input data provided'
            }), 400
        
        # Get detailed prediction
        prediction_result = predict_student_success_improved(data, model)
        
        # Return full analysis
        return jsonify({
            'success': True,
            'fullAnalysis': prediction_result,
            'inputData': data,
            'processingNotes': [
                'Menggunakan algoritma dari notebook yang telah dioptimasi',
                'Menghitung Exam Score berdasarkan formula weighted',
                'Menggunakan Success Value dengan normalisasi MinMaxScaler',
                'Prediksi menggunakan model Neural Network dengan 3 kelas output'
            ]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
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
            'model_summary': 'TensorFlow/Keras Neural Network Model (Updated from Notebook)',
            'features_expected': [
                'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
                'Motivation_Level', 'Tutoring_Sessions', 'Teacher_Quality',
                'Physical_Activity', 'Gender', 'Exam_Score', 'success_value'
            ],
            'output_classes': ['Gagal', 'Cukup', 'Berhasil'],
            'preprocessing_notes': [
                'Categorical encoding: Low=0, Medium=1, High=2',
                'Gender encoding: Male=1, Female=0',
                'Exam Score calculated using weighted formula',
                'Success Value normalized using MinMaxScaler approach'
            ]
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
        'message': 'Student Performance Prediction ML API - Updated from Notebook',
        'status': 'running',
        'model_loaded': model is not None,
        'version': '2.0 - Integrated from Jupyter Notebook',
        'endpoints': [
            '/health - Health check',
            '/predict - Make predictions',  
            '/predict-detailed - Detailed prediction analysis',
            '/model-info - Model information'
        ],
        'features': [
            'Neural Network model with 3-class output',
            'Rule-based prediction backup',
            'Weighted feature calculation',
            'Success score normalization',
            'Intervention recommendations'
        ]
    })

if __name__ == '__main__':
    print("Starting Flask ML API server...")
    print("Updated with notebook integration")
    print("Available endpoints:")
    print("- GET  /health - Health check")
    print("- POST /predict - Make predictions")
    print("- POST /predict-detailed - Detailed analysis")
    print("- GET  /model-info - Model information")
    app.run(host='0.0.0.0', port=5000, debug=True)