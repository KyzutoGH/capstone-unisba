// Simplified Random Forest model implementation for student success prediction
// In a real-world scenario, this would be integrated with an actual ML model

// Placeholder for Random Forest model
const generatePrediction = (inputData) => {
  // In a real application, this would call a trained ML model
  // For now, we'll use a simplified scoring system

  // Extract features
  const {
    hoursStudied,
    attendance,
    extracurricularActivities,
    sleepHours,
    previousScores,
    motivationLevel,
    tutoringSessions,
    teacherQuality,
    physicalActivity,
    learningDisabilities,
    gender, // 1 for male, 0 for female
  } = inputData;

  // Simple weighted scoring system (placeholder)
  let score = 0;
  
  // Study-related factors (60% weight)
  score += (hoursStudied / 10) * 15; // Max 15 points for study hours
  score += (attendance / 100) * 15; // Max 15 points for attendance
  score += (previousScores / 100) * 20; // Max 20 points for previous scores
  score += (motivationLevel / 10) * 10; // Max 10 points for motivation

  // Support factors (25% weight)
  score += tutoringSessions > 0 ? Math.min(tutoringSessions, 5) * 2 : 0; // Max 10 points for tutoring
  score += (teacherQuality / 10) * 10; // Max 10 points for teacher quality
  score += extracurricularActivities ? 5 : 0; // 5 points for extracurricular activities

  // Well-being factors (15% weight)
  score += sleepHours >= 7 ? 5 : (sleepHours / 7) * 5; // Max 5 points for sleep
  score += (physicalActivity / 10) * 5; // Max 5 points for physical activity
  score -= learningDisabilities ? 5 : 0; // -5 points if learning disabilities present
  
  // Normalize score to 0-100 range
  let predictionScore = Math.max(0, Math.min(100, score));
  
  // Determine prediction status
  let predictionStatus;
  if (predictionScore >= 70) {
    predictionStatus = 'success';
  } else if (predictionScore >= 50) {
    predictionStatus = 'at_risk';
  } else {
    predictionStatus = 'fail';
  }

  return {
    predictionScore: Math.round(predictionScore * 10) / 10, // Round to 1 decimal place
    predictionStatus,
  };
};

// Generate intervention recommendations based on prediction results
const getInterventionRecommendations = (data) => {
  const {
    predictionStatus,
    hoursStudied,
    attendance,
    extracurricularActivities,
    sleepHours,
    motivationLevel,
    tutoringSessions,
    physicalActivity,
    learningDisabilities,
  } = data;

  const recommendations = [];

  // Add general recommendation based on prediction status
  if (predictionStatus === 'at_risk') {
    recommendations.push('Siswa berada pada risiko kegagalan akademik dan membutuhkan perhatian ekstra.');
  } else if (predictionStatus === 'fail') {
    recommendations.push('Siswa memiliki risiko tinggi untuk gagal dan membutuhkan intervensi segera.');
  }

  // Add specific recommendations based on factors
  if (hoursStudied < 2) {
    recommendations.push('Tingkatkan waktu belajar setidaknya menjadi 2 jam per hari.');
  }

  if (attendance < 80) {
    recommendations.push('Tingkatkan kehadiran di kelas. Kehadiran minimal yang diharapkan adalah 80%.');
  }

  if (!extracurricularActivities) {
    recommendations.push('Pertimbangkan untuk berpartisipasi dalam aktivitas ekstrakurikuler untuk mengembangkan keterampilan sosial dan kepemimpinan.');
  }

  if (sleepHours < 7) {
    recommendations.push('Pastikan waktu tidur yang cukup (minimal 7-8 jam) untuk meningkatkan konsentrasi dan daya ingat.');
  }

  if (motivationLevel < 5) {
    recommendations.push('Berikan dukungan motivasi tambahan dan jadwalkan sesi konseling untuk meningkatkan motivasi belajar.');
  }

  if (tutoringSessions < 1) {
    recommendations.push('Tambahkan sesi bimbingan belajar untuk mata pelajaran yang sulit.');
  }

  if (physicalActivity < 3) {
    recommendations.push('Tingkatkan aktivitas fisik untuk meningkatkan kesehatan dan kemampuan kognitif.');
  }

  if (learningDisabilities) {
    recommendations.push('Berikan pendampingan khusus dan strategi pembelajaran yang disesuaikan untuk mengatasi kesulitan belajar.');
  }

  // Return recommendations as a formatted string
  return recommendations.join('\n\n');
};