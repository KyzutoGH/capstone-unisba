import { Bar } from 'react-chartjs-2';

const ClassPerformanceChart = ({ classPerformanceData }) => {
  if (!classPerformanceData || classPerformanceData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-center">
          Belum ada data performa kelas yang tersedia.
          <br />
          Buat prediksi untuk melihat chart ini.
        </p>
      </div>
    );
  }

  const data = {
    labels: classPerformanceData.map((item) => `Kelas ${item.class}`),
    datasets: [
      {
        label: 'Rata-rata Skor Prediksi',
        data: classPerformanceData.map((item) => parseFloat(item.averageScore) || 0),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const classData = classPerformanceData[context.dataIndex];
            return [
              `Rata-rata Skor: ${context.raw.toFixed(1)}`,
              `Jumlah Prediksi: ${classData.predictionCount || 0}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Rata-rata Skor Prediksi',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Kelas',
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ClassPerformanceChart;