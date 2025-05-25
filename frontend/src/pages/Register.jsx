import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Nama minimal 3 karakter')
      .max(50, 'Nama maksimal 50 karakter')
      .required('Nama diperlukan'),
    email: Yup.string()
      .email('Format email tidak valid')
      .required('Email diperlukan'),
    password: Yup.string()
      .min(6, 'Password minimal 6 karakter')
      .required('Password diperlukan'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password tidak cocok')
      .required('Konfirmasi password diperlukan'),
    role: Yup.string()
      .oneOf(['teacher', 'admin'], 'Role tidak valid')
      .required('Role diperlukan'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'teacher',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
 // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...userData } = values;
        await register(userData);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Registration failed:', err);
      }
    },
  });

  return (
    <div>
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {error && (
          <div className="p-3 rounded bg-danger-50 text-danger-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="form-label">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="form-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="Masukkan nama lengkap"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="form-error">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="contoh@email.com"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="form-error">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="role" className="form-label">
            Role / Peran
          </label>
          <select
            id="role"
            name="role"
            className="form-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
          >
            <option value="teacher">Guru</option>
            <option value="admin">Administrator</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="form-error">{formik.errors.role}</div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            <strong>Guru:</strong> Dapat mengelola siswa dan membuat prediksi<br/>
            <strong>Administrator:</strong> Akses penuh ke semua fitur sistem
          </p>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-input pr-10"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Minimal 6 karakter"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <HiOutlineEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-input pr-10"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              placeholder="Ulangi password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <HiOutlineEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="form-error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sudah memiliki akun?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;