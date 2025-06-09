import requests
import json

def test_flask_api():
    # Test different ports
    ports = [5000, 5001, 5002, 5003, 8000]
    
    for port in ports:
        try:
            url = f"http://localhost:{port}/health"
            print(f"Testing {url}...")
            
            response = requests.get(url, timeout=5)
            print(f"✅ Port {port}: {response.status_code}")
            print(f"Response: {response.json()}")
            
            # Test prediction endpoint
            predict_url = f"http://localhost:{port}/predict"
            test_data = {
                "hoursStudied": 5,
                "attendance": 85,
                "previousScores": 75,
                "motivationLevel": "High",
                "teacherQuality": "High",
                "extracurricularActivities": True,
                "sleepHours": 7,
                "tutoringSessions": 2,
                "physicalActivity": 1,
                "learningDisabilities": False,
                "gender": "Male"
            }
            
            pred_response = requests.post(predict_url, json=test_data, timeout=5)
            print(f"✅ Prediction test: {pred_response.status_code}")
            print(f"Prediction response: {pred_response.json()}")
            
            return port  # Return working port
            
        except requests.exceptions.ConnectionError:
            print(f"❌ Port {port}: Connection refused")
        except requests.exceptions.Timeout:
            print(f"❌ Port {port}: Timeout")
        except Exception as e:
            print(f"❌ Port {port}: {str(e)}")
    
    print("❌ No working Flask API found")
    return None

if __name__ == "__main__":
    working_port = test_flask_api()
    if working_port:
        print(f"\n🎉 Flask API is working on port {working_port}")
        print(f"Update your Node.js FLASK_API_URL to: http://localhost:{working_port}")
    else:
        print("\n💥 Flask API is not responding on any port")