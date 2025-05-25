import { forwardRef } from 'react';

const FormInput = forwardRef(
  (
    {
      label,
      id,
      type = 'text',
      name,
      placeholder = '',
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              error
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;