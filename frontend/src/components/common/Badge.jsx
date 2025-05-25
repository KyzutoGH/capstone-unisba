const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    info: 'bg-primary-100 text-primary-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

// Predefined status badges
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    success: { variant: 'success', text: 'Berhasil' },
    at_risk: { variant: 'warning', text: 'Berisiko' },
    fail: { variant: 'danger', text: 'Gagal' },
    active: { variant: 'success', text: 'Aktif' },
    inactive: { variant: 'danger', text: 'Tidak Aktif' },
    pending: { variant: 'warning', text: 'Pending' },
  };

  const config = statusConfig[status] || { variant: 'default', text: status };

  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default Badge;