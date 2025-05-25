import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, icon: Icon, bgColor, iconColor, linkTo, linkText }) => {
  // Default icon colors based on background color
  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    // Map background colors to appropriate icon colors
    const colorMap = {
      'bg-primary-100': 'text-primary-600',
      'bg-success-100': 'text-success-600', 
      'bg-warning-100': 'text-warning-600',
      'bg-danger-100': 'text-danger-600',
      'bg-secondary-100': 'text-secondary-600',
      'bg-info-100': 'text-info-600',
    };
    
    return colorMap[bgColor] || 'text-primary-600';
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${bgColor}`}>
            <Icon className={`h-6 w-6 ${getIconColor()}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {linkTo && linkText && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              to={linkTo}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {linkText}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;