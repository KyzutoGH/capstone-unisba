// ml/randomForestModel.js
// Fallback prediction model when Flask API is not available

/**
 * Generate prediction using fallback algorithm
 * @param {Object} inputData - Student data for prediction
 * @returns {Object} Prediction result
 */
const generatePrediction = (inputData) => {
  try {
    const {
      hoursStudied = 0,
      attendance = 0,
      extracurricularActivities = false,
      sleepHours = 7,
      previousScores = 0,
      motivationLevel = 5, // 1-10 scale or converted from High/Medium/Low
      tutoringSessions = 0,
      teacherQuality = 5, // 1-10 scale or converted from High/Medium/Low
      physicalActivity = 0,
      learningDisabilities = false,
      gender = 0 // 0 for female, 1 for male
    } = inputData;

    // Weighted scoring algorithm
    const weights = {
      hoursStudied: 0.20,
      attendance: 0.25,
      previousScores: 0.30,
      motivationLevel: 0.10,
      teacherQuality: 0.05,
      tutoringSessions: 0.05,
      sleepHours: 0.03,
      physicalActivity: 0.02
    };

    // Normalize scores to 0-10 scale
    const normalizedScores = {
      hoursStudied: Math.min(hoursStudied / 8 * 10, 10), // Assuming 8 hours max
      attendance: attendance / 10, // attendance is already in percentage, convert to 0-10
      previousScores: previousScores / 10, // assuming previousScores is 0-100, convert to 0-10
      motivationLevel: motivationLevel,
      teacherQuality: teacherQuality,
      tutoringSessions: Math.min(tutoringSessions / 5 * 10, 10), // Assuming 5 sessions max
      sleepHours: Math.min(sleepHours / 8 * 10, 10), // 8 hours optimal
      physicalActivity: Math.min(physicalActivity / 3 * 10, 10) // 3 hours max
    };

    // Calculate weighted score
    let weightedScore = 0;
    for (const [factor, weight] of Object.entries(weights)) {
      weightedScore += normalizedScores[factor] * weight;
    }

    // Apply bonuses and penalties
    let bonusScore = 0;

    // Extracurricular activities bonus
    if (extracurricularActivities) {
      bonusScore += 0.5;
    }

    // Learning disabilities penalty
    if (learningDisabilities) {
      bonusScore -= 0.8;
    }

    // Sleep quality bonus/penalty
    if (sleepHours >= 7 && sleepHours <= 8) {
      bonusScore += 0.3;
    } else if (sleepHours < 6) {
      bonusScore -= 0.5;
    }

    // Study consistency bonus
    if (hoursStudied >= 3 && attendance >= 80) {
      bonusScore += 0.4;
    }

    // High performance combo bonus
    if (previousScores >= 80 && motivationLevel >= 7 && teacherQuality >= 7) {
      bonusScore += 0.6;
    }

    // Calculate final score
    let finalScore = (weightedScore + bonusScore) * 10; // Convert to 0-100 scale
    
    // Ensure score is within bounds
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    // Round to 2 decimal places
    const predictionScore = Math.round(finalScore * 100) / 100;

    // Determine prediction status
    let predictionStatus;
    if (predictionScore <= 40) {
      predictionStatus = 'fail';
    } else if (predictionScore <= 74) {
      predictionStatus = 'at_risk';
    } else {
      predictionStatus = 'success';
    }

    return {
      predictionScore,
      predictionStatus
    };

  } catch (error) {
    console.error('Fallback prediction error:', error);
    // Return default safe prediction
    return {
      predictionScore: 50,
      predictionStatus: 'at_risk'
    };
  }
};

/**
 * Generate intervention recommendations based on student data and prediction
 * @param {Object} data - Student data and prediction result
 * @returns {Array} Array of intervention recommendations
 */
const getInterventionRecommendations = (data) => {
  const recommendations = [];
  
  try {
    const {
      predictionStatus,
      hoursStudied = 0,
      attendance = 0,
      extracurricularActivities = false,
      sleepHours = 7,
      motivationLevel = 'Medium',
      tutoringSessions = 0,
      physicalActivity = 0,
      learningDisabilities = false
    } = data;

    // Study time recommendations
    if (hoursStudied < 3) {
      recommendations.push(
        "📚 **Tingkatkan Waktu Belajar**: Alokasikan minimal 3-4 jam belajar per hari untuk mencapai hasil optimal. Buat jadwal belajar yang konsisten dan patuhi."
      );
    }

    // Attendance recommendations
    if (attendance < 80) {
      recommendations.push(
        "🎯 **Perbaiki Kehadiran**: Target kehadiran minimal 80%. Kehadiran yang konsisten sangat penting untuk memahami materi dan mengikuti perkembangan pembelajaran."
      );
    }

    // Sleep recommendations
    if (sleepHours < 7) {
      recommendations.push(
        "😴 **Optimalkan Waktu Tidur**: Pastikan tidur 7-8 jam per malam. Tidur yang cukup meningkatkan konsentrasi dan kemampuan mengingat."
      );
    } else if (sleepHours > 9) {
      recommendations.push(
        "⏰ **Atur Pola Tidur**: Hindari tidur berlebihan. Tidur 7-8 jam sudah optimal untuk performa akademik yang baik."
      );
    }

    // Motivation recommendations
    if (motivationLevel === 'Low') {
      recommendations.push(
        "🔥 **Tingkatkan Motivasi**: Temukan sumber motivasi belajar, bergabung dengan grup belajar, atau cari mentor yang dapat memberikan dukungan dan inspirasi."
      );
    }

    // Tutoring recommendations
    if (tutoringSessions === 0 && (predictionStatus === 'fail' || predictionStatus === 'at_risk')) {
      recommendations.push(
        "👨‍🏫 **Pertimbangkan Tutoring**: Ikuti sesi bimbingan belajar tambahan untuk memperkuat pemahaman materi yang masih lemah."
      );
    }

    // Physical activity recommendations
    if (physicalActivity < 1) {
      recommendations.push(
        "🏃‍♂️ **Tambahkan Aktivitas Fisik**: Lakukan olahraga ringan 30-60 menit per hari untuk meningkatkan konsentrasi dan mengurangi stress."
      );
    }

    // Extracurricular recommendations
    if (!extracurricularActivities && predictionStatus === 'success') {
      recommendations.push(
        "🎭 **Kegiatan Ekstrakurikuler**: Pertimbangkan mengikuti kegiatan ekstrakurikuler untuk mengembangkan soft skills dan keseimbangan hidup."
      );
    }

    // Learning disabilities support
    if (learningDisabilities) {
      recommendations.push(
        "🧠 **Dukungan Khusus**: Konsultasi dengan konselor akademik untuk mendapatkan strategi belajar yang sesuai dengan kebutuhan khusus Anda."
      );
    }

    // Specific recommendations based on prediction status
    if (predictionStatus === 'fail') {
      recommendations.push(
        "⚠️ **Perhatian Khusus**: Status prediksi menunjukkan risiko tinggi. Segera konsultasi dengan guru/dosen dan buat rencana perbaikan intensif."
      );
    } else if (predictionStatus === 'at_risk') {
      recommendations.push(
        "📈 **Perbaikan Diperlukan**: Status menunjukkan perlu perbaikan. Fokus pada area yang lemah dan konsisten dalam penerapan strategi belajar."
      );
    } else {
      recommendations.push(
        "✅ **Pertahankan Performa**: Hasil prediksi bagus! Pertahankan kebiasaan belajar yang sudah baik dan terus tingkatkan kualitas."
      );
    }

    // General study tips
    recommendations.push(
      "💡 **Tips Umum**: Buat catatan yang rapi, review materi secara berkala, manfaatkan teknologi belajar, dan jangan ragu bertanya saat ada kesulitan."
    );

    return recommendations;

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [
      "📚 Tingkatkan waktu belajar dan kehadiran di kelas",
      "💡 Konsultasi dengan guru untuk strategi belajar yang lebih efektif",
      "⚖️ Jaga keseimbangan antara belajar, istirahat, dan aktivitas fisik"
    ];
  }
};

module.exports = {
  generatePrediction,
  getInterventionRecommendations
};