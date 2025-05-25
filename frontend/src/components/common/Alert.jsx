import {
  HiOutlineInformationCircle,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineX,
} from 'react-icons/hi';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertTypes = {
    info: {
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-400',
      textColor: 'text-primary-700',
      iconColor: 'text-primary-400',
      icon: HiOutlineInformationCircle,
    },
    success: {
      bgColor: 'bg-success-50',
      borderColor: 'border-success-400',
      textColor: 'text-success-700',
      iconColor: 'text-success-400',
      icon: HiOutlineCheckCircle,
    },
    warning: {
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-400',
      textColor: 'text-warning-700',
      iconColor: 'text-warning-400',
      icon: HiOutlineExclamation,
    },
    error: {
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-400',
      textColor: 'text-danger-700',
      iconColor: 'text-danger-400',
      icon: HiOutlineExclamation,
    },
  };

  const { bgColor, borderColor, textColor, iconColor, icon: Icon } = alertTypes[type];

  return (
    <div
      className={`rounded-md ${bgColor} p-4 border-l-4 ${borderColor}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${bgColor} ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'info' ? 'primary' : type}-500`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <HiOutlineX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;