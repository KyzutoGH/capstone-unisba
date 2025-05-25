// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (Indonesia format)
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone);
};

// Student ID validation
export const isValidStudentId = (studentId) => {
  // Allow alphanumeric characters, minimum 3 characters
  const studentIdRegex = /^[a-zA-Z0-9]{3,20}$/;
  return studentIdRegex.test(studentId);
};

// Name validation
export const isValidName = (name) => {
  // Allow letters, spaces, dots, and apostrophes
  const nameRegex = /^[a-zA-Z\s.']{2,50}$/;
  return nameRegex.test(name);
};

// Number range validation
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Date validation
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const isDateInPast = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date < today;
};

export const isDateInFuture = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// File validation
export const isValidImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

// Custom validation messages
export const getValidationMessage = (field, rule, value = null) => {
  const messages = {
    required: `${field} wajib diisi`,
    email: `${field} harus berupa alamat email yang valid`,
    minLength: `${field} minimal ${value} karakter`,
    maxLength: `${field} maksimal ${value} karakter`,
    min: `${field} minimal ${value}`,
    max: `${field} maksimal ${value}`,
    range: `${field} harus antara ${value.min} dan ${value.max}`,
    pattern: `Format ${field} tidak valid`,
    strongPassword: 'Password harus minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka',
    phoneNumber: 'Nomor telepon harus dalam format Indonesia yang valid',
    studentId: 'ID Siswa harus terdiri dari 3-20 karakter alfanumerik',
    name: 'Nama hanya boleh mengandung huruf, spasi, titik, dan apostrof',
    pastDate: `${field} harus berupa tanggal di masa lalu`,
    futureDate: `${field} harus berupa tanggal di masa depan`,
    imageFile: 'File harus berupa gambar (JPEG, PNG, GIF) dengan ukuran maksimal 5MB',
  };
  
  return messages[rule] || `${field} tidak valid`;
};