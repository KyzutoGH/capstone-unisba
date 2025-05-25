// Date formatters
export const formatDate = (dateString, locale = 'id-ID') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString, locale = 'id-ID') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Number formatters
export const formatNumber = (number, decimals = 1) => {
  if (number === null || number === undefined) return '-';
  return Number(number).toFixed(decimals);
};

export const formatPercentage = (number, decimals = 1) => {
  if (number === null || number === undefined) return '-';
  return `${Number(number).toFixed(decimals)}%`;
};

// Status formatters
export const formatPredictionStatus = (status) => {
  const statusMap = {
    success: 'Berhasil',
    at_risk: 'Berisiko',
    fail: 'Gagal',
  };
  return statusMap[status] || status;
};

export const formatGender = (gender) => {
  const genderMap = {
    male: 'Laki-laki',
    female: 'Perempuan',
  };
  return genderMap[gender] || gender;
};

// Text formatters
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};