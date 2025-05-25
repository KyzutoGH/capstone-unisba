import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Halaman Tidak Ditemukan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. 
              Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/dashboard">
              <Button variant="primary">
                <HiOutlineHome className="mr-2 h-5 w-5" />
                Kembali ke Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;