import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlinePencilAlt,
  HiOutlineChartBar,
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { studentService, predictionService } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge, { StatusBadge } from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import InterventionRecommendations from '../components/prediction/InterventionRecommendations';
import { formatDate, formatDateTime, formatGender } from '../utils/formatters';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);

        // Fetch student details
        const studentResponse = await studentService.getStudentById(id);
        setStudent(studentResponse.data.data);

        // Fetch student predictions - PERBAIKAN DI SINI
        const predictionsResponse = await predictionService.getStudentPredictions(id);
        console.log("Predictions data:", predictionsResponse.data); // Debugging

        // Ambil data dari response.data.data.predictions, bukan response.data.data
        const predictionsData = predictionsResponse.data.data?.predictions || [];
        setPredictions(predictionsData);

      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.response?.status === 404
          ? 'Siswa tidak ditemukan'
          : 'Gagal memuat data siswa. Silakan coba lagi nanti.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return <Loading size="lg" text="Memuat data siswa..." fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert type="error" message={error} />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate('/students')}>
            Kembali ke Daftar Siswa
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data siswa tidak ditemukan</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/students')}>
          Kembali ke Daftar Siswa
        </Button>
      </div>
    );
  }

  const latestPrediction = predictions.length > 0 ? predictions[0] : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Siswa
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Detail Siswa
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Informasi lengkap dan riwayat prediksi siswa
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link to={`/students/${id}/edit`}>
              <Button variant="outline">
                <HiOutlinePencilAlt className="mr-2 h-4 w-4" />
                Edit Data
              </Button>
            </Link>
            <Link to={`/students/${id}/predict`}>
              <Button variant="primary">
                <HiOutlineChartBar className="mr-2 h-4 w-4" />
                Buat Prediksi
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <div className="lg:col-span-1">
          <Card title="Informasi Siswa">
            <div className="text-center">
              <div className="mx-auto h-32 w-32 mb-4">
                {student.photo ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${student.photo}`}
                    alt={student.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiOutlineUserCircle className="h-20 w-20 text-primary-600" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-500">ID: {student.studentId}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <HiOutlineIdentification className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jenis Kelamin</p>
                  <p className="text-sm text-gray-500">{formatGender(student.gender)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <HiOutlineCalendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tanggal Lahir</p>
                  <p className="text-sm text-gray-500">{formatDate(student.dateOfBirth)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Kelas</p>
                  <p className="text-sm text-gray-500">
                    {student.grade} - {student.class}
                  </p>
                </div>
              </div>
            </div>

            {/* Latest Prediction Status */}
            {latestPrediction && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Status Prediksi Terbaru
                </h3>
                <div className="flex items-center justify-between">
                  <StatusBadge status={latestPrediction.predictionStatus} />
                  <span className="text-sm text-gray-500">
                    Skor: {latestPrediction.predictionScore}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(latestPrediction.createdAt)}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Predictions and Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Prediction Detail */}
          {latestPrediction && (
            <Card title="Prediksi Terbaru"
              headerActions={
                <Link to={`/predictions/${latestPrediction.id}`}>
                  <Button variant="outline" size="sm">
                    Lihat Detail
                  </Button>
                </Link>
              }>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-900">Skor Prediksi</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {latestPrediction.predictionScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={latestPrediction.predictionStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Semester</p>
                  <p className="text-sm text-gray-500">{latestPrediction.semester}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tahun Ajaran</p>
                  <p className="text-sm text-gray-500">{latestPrediction.academicYear}</p>
                </div>
              </div>

              {/* Key Factors */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Jam Belajar:</span>
                  <span className="ml-1">{latestPrediction.hoursStudied} jam</span>
                </div>
                <div>
                  <span className="font-medium">Kehadiran:</span>
                  <span className="ml-1">{latestPrediction.attendance}%</span>
                </div>
                <div>
                  <span className="font-medium">Jam Tidur:</span>
                  <span className="ml-1">{latestPrediction.sleepHours} jam</span>
                </div>
                <div>
                  <span className="font-medium">Nilai Sebelumnya:</span>
                  <span className="ml-1">{latestPrediction.previousScores}</span>
                </div>
                <div>
                  <span className="font-medium">Motivasi:</span>
                  <span className="ml-1">{latestPrediction.motivationLevel}/10</span>
                </div>
                <div>
                  <span className="font-medium">Bimbingan:</span>
                  <span className="ml-1">{latestPrediction.tutoringSessions} sesi</span>
                </div>
              </div>
            </Card>
          )}

          {/* Intervention Recommendations */}
          {latestPrediction?.interventionRecommendations && (
            <InterventionRecommendations
              recommendations={latestPrediction.interventionRecommendations}
            />
          )}

          {/* Prediction History */}
          <Card title={`Riwayat Prediksi (${predictions.length})`}>
            {predictions.length > 0 ? (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={prediction.predictionStatus} />
                        <span className="text-sm font-medium text-gray-900">
                          Skor: {prediction.predictionScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {prediction.semester} - {prediction.academicYear}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(prediction.createdAt)}
                      </p>
                    </div>
                    <Link to={`/predictions/${prediction.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HiOutlineChartBar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada prediksi
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Buat prediksi pertama untuk siswa ini.
                </p>
                <div className="mt-6">
                  <Link to={`/students/${id}/predict`}>
                    <Button variant="primary">
                      <HiOutlineChartBar className="mr-2 h-4 w-4" />
                      Buat Prediksi
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;