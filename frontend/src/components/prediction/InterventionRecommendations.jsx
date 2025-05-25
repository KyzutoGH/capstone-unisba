import { HiOutlineLightBulb } from 'react-icons/hi';

const InterventionRecommendations = ({ recommendations }) => {
  if (!recommendations) {
    return null;
  }

  const recommendationList = recommendations.split('\n\n').filter(Boolean);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-primary-50 border-b border-primary-100">
        <div className="flex items-center">
          <HiOutlineLightBulb className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-primary-900">Rekomendasi Intervensi</h3>
        </div>
      </div>
      <div className="p-4">
        {recommendationList.length > 0 ? (
          <div className="space-y-3">
            {recommendationList.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Tidak ada rekomendasi khusus untuk prediksi ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default InterventionRecommendations;