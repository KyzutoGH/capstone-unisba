const Card = ({
  children,
  title,
  subtitle,
  headerActions,
  className = '',
  padding = true,
  shadow = true,
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const shadowClass = shadow ? 'shadow-sm' : '';
  const paddingClass = padding ? 'p-6' : '';

  return (
    <div className={`${baseClasses} ${shadowClass} ${className}`}>
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center space-x-2">{headerActions}</div>
            )}
          </div>
        </div>
      )}
      <div className={paddingClass}>{children}</div>
    </div>
  );
};

export default Card;