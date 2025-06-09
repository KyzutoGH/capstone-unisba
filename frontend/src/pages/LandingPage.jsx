import { Link } from 'react-router-dom';
import { 
  HiOutlineChartBar, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineCheckCircle,
  HiOutlineArrowRight
} from 'react-icons/hi';

const LandingPage = () => {
  const features = [
    {
      icon: HiOutlineChartBar,
      title: 'Prediksi Akurat',
      description: 'Menggunakan algoritma Random Forest untuk prediksi keberhasilan belajar siswa dengan tingkat akurasi tinggi.'
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Manajemen Siswa',
      description: 'Kelola data siswa dengan mudah dan monitor progress mereka secara real-time.'
    },
    {
      icon: HiOutlineAcademicCap,
      title: 'Analisis Mendalam',
      description: 'Dapatkan insight mendalam tentang faktor-faktor yang mempengaruhi keberhasilan belajar.'
    },
    {
      icon: HiOutlineLightBulb,
      title: 'Rekomendasi Cerdas',
      description: 'Terima rekomendasi berbasis data untuk meningkatkan performa akademik siswa.'
    }
  ];

  const benefits = [
    'Identifikasi siswa yang berisiko mengalami kesulitan belajar',
    'Optimalkan strategi pembelajaran berdasarkan data',
    'Tingkatkan tingkat keberhasilan siswa secara keseluruhan',
    'Buat keputusan yang tepat berdasarkan analisis prediktif'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <header className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-auto sm:h-10"
                        src="/logo.svg"
                        alt="Student Success"
                      />
                      <span className="ml-2 text-xl font-bold text-primary-900">Student Success</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              </nav>
            </header>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Prediksi</span>{' '}
                  <span className="block text-primary-600 xl:inline">Keberhasilan Belajar</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Aplikasi berbasis machine learning yang menggunakan algoritma Random Forest untuk memprediksi keberhasilan belajar siswa dan memberikan insight untuk meningkatkan kualitas pendidikan.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Mulai Sekarang
                      <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Sudah Punya Akun?
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <HiOutlineAcademicCap className="mx-auto h-24 w-24 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Machine Learning</h3>
              <p className="text-lg opacity-90">Random Forest Algorithm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Fitur Unggulan</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Teknologi Terdepan untuk Pendidikan
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Manfaatkan kekuatan machine learning untuk memahami dan meningkatkan hasil belajar siswa.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-primary-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Mengapa Memilih</span>
              <span className="block text-primary-600">Student Success?</span>
            </h2>
            <div className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-primary-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-primary-100 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Preview</h3>
                <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
                  <HiOutlineChartBar className="h-12 w-12 text-gray-400" />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Interface yang intuitif dan mudah digunakan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Siap untuk mulai?</span>
            <span className="block">Daftar sekarang juga.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Bergabunglah dengan ribuan pendidik yang telah merasakan manfaat teknologi prediktif dalam meningkatkan kualitas pembelajaran.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto transition-colors"
          >
            Daftar Gratis
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Student Success"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">Student Success</span>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 Capstone Project Team UNISBA. Aplikasi Prediksi Keberhasilan Belajar Siswa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;