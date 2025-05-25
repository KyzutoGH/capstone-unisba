import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.svg"
            alt="Student Success"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Aplikasi Prediksi Keberhasilan Belajar Siswa
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Menggunakan Algoritma Random Forest
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;