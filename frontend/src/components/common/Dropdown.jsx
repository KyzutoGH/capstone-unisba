import { useState, useRef, useEffect } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  width = 'w-48',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center items-center"
        >
          {trigger}
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 ${width} ${alignmentClasses[align]} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({ 
  children, 
  onClick, 
  href, 
  className = '',
  icon: Icon,
  variant = 'default'
}) => {
  const baseClasses = 'flex items-center px-4 py-2 text-sm cursor-pointer';
  const variantClasses = {
    default: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-danger-700 hover:bg-danger-50',
    primary: 'text-primary-700 hover:bg-primary-50'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {Icon && <Icon className="mr-3 h-4 w-4" />}
        {children}
      </a>
    );
  }

  return (
    <button className={`${classes} w-full text-left`} onClick={onClick}>
      {Icon && <Icon className="mr-3 h-4 w-4" />}
      {children}
    </button>
  );
};

// Dropdown Divider Component
export const DropdownDivider = () => (
  <div className="border-t border-gray-100 my-1" />
);

export default Dropdown;