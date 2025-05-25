import { Doughnut } from 'react-chartjs-2';

const PredictionStatusChart = ({ predictionStats }) => {
  const data = {
    labels: ['Berhasil', 'Berisiko', 'Gagal'],
    datasets: [
      {
        data: [
          predictionStats?.success || 0,
          predictionStats?.at_risk || 0,
          predictionStats?.fail || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // success - hijau
          'rgba(245, 158, 11, 0.8)',  // at_risk - kuning
          'rgba(239, 68, 68, 0.8)',   // fail - merah
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  // If there's no prediction data, show a message
  if (!predictionStats || (predictionStats.success === 0 && predictionStats.at_risk === 0 && predictionStats.fail === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-center">
          Belum ada data prediksi yang tersedia.
          <br />
          Buat prediksi untuk melihat chart ini.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PredictionStatusChart;