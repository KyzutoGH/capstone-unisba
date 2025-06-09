import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineXCircle,
  HiOutlineChartBar,
} from 'react-icons/hi';
import { dashboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DashboardCard from '../components/dashboard/DashboardCard';
import PredictionStatusChart from '../components/dashboard/PredictionStatusChart';
import ClassPerformanceChart from '../components/dashboard/ClassPerformanceChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats();
      console.log('Dashboard Stats Response:', response.data.data); // Add this line
      setStats(response.data.data);
      setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        if (err.response?.status === 401) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
        } else if (err.response?.status === 500) {
          setError('Terjadi kesalahan pada server. Data mungkin belum tersedia.');
        } else {
          setError('Gagal memuat data statistik. Silakan coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 text-danger-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  // Prepare chart data (remove these as we now use separate components)
  // const predictionStatusData = { ... }
  // const classPerformanceData = { ... }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selamat datang, {user?.name}! Berikut adalah ringkasan data prediksi keberhasilan belajar siswa.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <DashboardCard
          title="Total Siswa"
          value={stats?.totalStudents || 0}
          icon={HiOutlineUsers}
          bgColor="bg-primary-100"
          iconColor="text-primary-600"
          linkTo="/students"
          linkText="Lihat semua siswa"
        />

        <DashboardCard
          title="Prediksi Berhasil"
          value={stats?.predictionStats.success || 0}
          icon={HiOutlineCheckCircle}
          bgColor="bg-success-100"
          iconColor="text-success-600"
        />

        <DashboardCard
          title="Prediksi Berisiko"
          value={stats?.predictionStats.at_risk || 0}
          icon={HiOutlineExclamation}
          bgColor="bg-warning-100"
          iconColor="text-warning-600"
        />

        <DashboardCard
          title="Prediksi Gagal"
          value={stats?.predictionStats.fail || 0}
          icon={HiOutlineXCircle}
          bgColor="bg-danger-100"
          iconColor="text-danger-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Status Prediksi
            </h3>
            <PredictionStatusChart predictionStats={stats?.predictionStats} />
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Performa Kelas
            </h3>
            <ClassPerformanceChart classPerformanceData={stats?.classPerformance} />
          </div>
        </div>
      </div>

      {/* Recent predictions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Prediksi Terbaru
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Detail</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentPredictions && stats.recentPredictions.length > 0 ? (
                stats.recentPredictions.map((prediction) => (
                  <tr key={prediction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {prediction.student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {prediction.student.grade} - {prediction.student.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {prediction.predictionScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prediction.predictionStatus === 'success'
                            ? 'bg-success-100 text-success-800'
                            : prediction.predictionStatus === 'at_risk'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-danger-100 text-danger-800'
                        }`}
                      >
                        {prediction.predictionStatus === 'success'
                          ? 'Berhasil'
                          : prediction.predictionStatus === 'at_risk'
                          ? 'Berisiko'
                          : 'Gagal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(prediction.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/predictions/${prediction.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    Belum ada prediksi yang dibuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;