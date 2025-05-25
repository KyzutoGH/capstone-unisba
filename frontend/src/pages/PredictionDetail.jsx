import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { predictionService } from '../services/api';
import Card from '../components/common/Card';
import Badge, { StatusBadge } from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import InterventionRecommendations from '../components/prediction/InterventionRecommendations';
import { formatDateTime, formatGender } from '../utils/formatters';

const PredictionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await predictionService.getPredictionById(id);
        setPrediction(response.data.data);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError(err.response?.status === 404 
          ? 'Prediksi tidak ditemukan' 
          : 'Gagal memuat data prediksi. Silakan coba lagi nanti.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [id]);

  if (loading) {
    return <Loading size="lg" text="Memuat data prediksi..." fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert type="error" message={error} />
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data prediksi tidak ditemukan</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>
    );
  }

  const student = prediction.student;
  
  // Prediction factors for display
  const predictionFactors = [
    { label: 'Jam Belajar per Hari', value: `${prediction.hoursStudied} jam`, icon: HiOutlineClock },
    { label: 'Kehadiran', value: `${prediction.attendance}%`, icon: HiOutlineClipboardCheck },
    { label: 'Aktivitas Ekstrakurikuler', value: prediction.extracurricularActivities ? 'Ya' : 'Tidak', icon: HiOutlineAcademicCap },
    { label: 'Jam Tidur per Hari', value: `${prediction.sleepHours} jam`, icon: HiOutlineClock },
    { label: 'Rata-rata Nilai Sebelumnya', value: prediction.previousScores, icon: HiOutlineChartBar },
    { label: 'Tingkat Motivasi', value: `${prediction.motivationLevel}/10`, icon: HiOutlineUser },
    { label: 'Sesi Bimbingan per Bulan', value: `${prediction.tutoringSessions} sesi`, icon: HiOutlineAcademicCap },
    { label: 'Kualitas Pengajar', value: `${prediction.teacherQuality}/10`, icon: HiOutlineUser },
    { label: 'Tingkat Aktivitas Fisik', value: `${prediction.physicalActivity}/10`, icon: HiOutlineUser },
    { label: 'Kesulitan Belajar', value: prediction.learningDisabilities ? 'Ada' : 'Tidak Ada', icon: HiOutlineUser },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Detail Prediksi Keberhasilan Belajar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Hasil prediksi dan analisis faktor-faktor yang mempengaruhi keberhasilan belajar
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to={`/students/${student.id}`}>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <HiOutlineUser className="mr-2 h-4 w-4" />
                Lihat Profil Siswa
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info & Prediction Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Info */}
          <Card title="Informasi Siswa">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 mb-4">
                {student.photo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${student.photo}`}
                    alt={student.name}
                    className="h-20 w-20 rounded-full object-cover border-2 border-primary-100"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiOutlineUser className="h-12 w-12 text-primary-600" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500">ID: {student.studentId}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="font-medium">Kelas:</span> {student.grade} - {student.class}</p>
                <p><span className="font-medium">Jenis Kelamin:</span> {formatGender(student.gender)}</p>
              </div>
            </div>
          </Card>

          {/* Prediction Summary */}
          <Card title="Ringkasan Prediksi">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {prediction.predictionScore}
                </div>
                <div className="mb-2">
                  <StatusBadge status={prediction.predictionStatus} />
                </div>
                <p className="text-sm text-gray-500">Skor Prediksi</p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Semester:</span>
                  <span>{prediction.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tahun Ajaran:</span>
                  <span>{prediction.academicYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tanggal Prediksi:</span>
                  <span>{formatDateTime(prediction.createdAt)}</span>
                </div>
                {prediction.examScore && (
                  <div className="flex justify-between">
                    <span className="font-medium">Nilai Ujian:</span>
                    <span>{prediction.examScore}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Factors */}
          <Card title="Faktor-faktor Prediksi">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictionFactors.map((factor, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-2 mr-3">
                    <factor.icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{factor.label}</p>
                    <p className="text-sm text-gray-600">{factor.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Prediction Status Analysis */}
          <Card title="Analisis Status Prediksi">
            <div className="space-y-4">
              <div className="flex items-center">
                <StatusBadge status={prediction.predictionStatus} />
                <span className="ml-3 text-lg font-medium text-gray-900">
                  {prediction.predictionStatus === 'success' && 'Prediksi Berhasil'}
                  {prediction.predictionStatus === 'at_risk' && 'Berisiko Gagal'}
                  {prediction.predictionStatus === 'fail' && 'Berisiko Tinggi Gagal'}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Interpretasi Hasil</h4>
                <p className="text-sm text-gray-700">
                  {prediction.predictionStatus === 'success' && 
                    'Berdasarkan analisis faktor-faktor pembelajaran, siswa ini diprediksi akan berhasil dalam pembelajaran. Pertahankan pola belajar yang sudah baik dan terus berikan dukungan positif.'
                  }
                  {prediction.predictionStatus === 'at_risk' && 
                    'Siswa ini berada pada risiko mengalami kesulitan dalam pembelajaran. Diperlukan perhatian ekstra dan monitoring lebih intensif untuk membantu meningkatkan performa akademiknya.'
                  }
                  {prediction.predictionStatus === 'fail' && 
                    'Siswa ini memiliki risiko tinggi untuk mengalami kegagalan akademik. Diperlukan intervensi segera dan strategi pembelajaran khusus untuk membantu siswa mencapai keberhasilan.'
                  }
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-medium text-primary-900 mb-2">Breakdown Skor</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Skor Prediksi:</span>
                    <span className="font-semibold">{prediction.predictionScore}/100</span>
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${prediction.predictionScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-primary-700 mt-2">
                    Skor di atas 70: Berhasil | 50-70: Berisiko | Di bawah 50: Gagal
                  </p>
                </div>
              </div>

              {/* Factor Analysis */}
              <div className="bg-warning-50 p-4 rounded-lg">
                <h4 className="font-medium text-warning-900 mb-2">Analisis Faktor Kunci</h4>
                <div className="space-y-2 text-sm text-warning-800">
                  {prediction.attendance < 80 && (
                    <p>• <strong>Kehadiran rendah:</strong> Tingkatkan kehadiran untuk hasil yang lebih baik</p>
                  )}
                  {prediction.hoursStudied < 3 && (
                    <p>• <strong>Waktu belajar kurang:</strong> Perlu menambah jam belajar harian</p>
                  )}
                  {prediction.sleepHours < 7 && (
                    <p>• <strong>Kurang tidur:</strong> Pastikan tidur yang cukup untuk konsentrasi optimal</p>
                  )}
                  {prediction.motivationLevel < 6 && (
                    <p>• <strong>Motivasi rendah:</strong> Perlu dukungan untuk meningkatkan motivasi belajar</p>
                  )}
                  {prediction.tutoringSessions === 0 && (
                    <p>• <strong>Tanpa bimbingan:</strong> Pertimbangkan untuk mengikuti sesi bimbingan</p>
                  )}
                  {prediction.learningDisabilities && (
                    <p>• <strong>Kesulitan belajar:</strong> Memerlukan strategi pembelajaran khusus</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Intervention Recommendations */}
          {prediction.interventionRecommendations && (
            <InterventionRecommendations 
              recommendations={prediction.interventionRecommendations} 
            />
          )}

          {/* Next Steps */}
          <Card title="Langkah Selanjutnya">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">1</span>
                </div>
                <p className="text-sm text-gray-700">
                  Diskusikan hasil prediksi ini dengan siswa dan orang tua untuk membangun kesadaran tentang area yang perlu diperbaiki.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  Implementasikan rekomendasi intervensi yang telah diberikan secara bertahap dan konsisten.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  Lakukan evaluasi berkala dengan membuat prediksi baru setelah 1-2 bulan untuk melihat perkembangan.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">4</span>
                </div>
                <p className="text-sm text-gray-700">
                  Dokumentasikan perubahan dan perbaikan yang terjadi untuk referensi evaluasi selanjutnya.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/students/${student.id}/predict`} className="flex-1">
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <HiOutlineChartBar className="mr-2 h-4 w-4" />
                Buat Prediksi Baru
              </button>
            </Link>
            <Link to={`/students/${student.id}`} className="flex-1">
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <HiOutlineUser className="mr-2 h-4 w-4" />
                Lihat Profil Siswa
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;