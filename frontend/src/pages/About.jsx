import { HiOutlineAcademicCap, HiOutlineChartPie, HiOutlineClipboardCheck, HiOutlineUserGroup } from 'react-icons/hi';

const About = () => {
  const features = [
    {
      title: 'Prediksi Akurat dengan Random Forest',
      description: 'Menggunakan algoritma Random Forest untuk memprediksi keberhasilan belajar siswa dengan tingkat akurasi tinggi berdasarkan berbagai parameter.',
      icon: HiOutlineChartPie,
    },
    {
      title: 'Dashboard Visualisasi Data',
      description: 'Menyajikan visualisasi data yang komprehensif untuk memudahkan guru dan administrator memantau kinerja siswa dan mengambil keputusan.',
      icon: HiOutlineClipboardCheck,
    },
    {
      title: 'Rekomendasi Intervensi',
      description: 'Memberikan rekomendasi tindakan intervensi yang dapat diambil berdasarkan hasil prediksi untuk meningkatkan kinerja siswa.',
      icon: HiOutlineAcademicCap,
    },
    {
      title: 'Manajemen Siswa',
      description: 'Menyediakan fitur manajemen data siswa yang lengkap untuk memudahkan pengelolaan informasi siswa dan catatan prediksi.',
      icon: HiOutlineUserGroup,
    },
  ];

  const team = [
    {
      name: 'Muhammad Ikhsan',
      role: 'Project Manager, Machine Learning Engineer',
      image: '/images/ikhsan.jpg',
    },
    {
      name: 'Moch Ichwan Alif Kurniawan',
      role: 'Machine Learning Engineer',
      image: '/images/alif.jpg',
    },
    {
      name: 'Adhi Eka Syahputra',
      role: 'Machine Learning Engineer',
      image: '/images/adhi.jpg',
    },
    {
      name: 'Alfian Anwar Shodiqi',
      role: 'Back-End Developer',
      image: '/images/diki.jpg',
    },
    {
      name: 'Jihan Khansa Nadhila',
      role: 'Front-End Developer',
      image: '/images/jihan.jpg',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tentang Aplikasi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Informasi tentang aplikasi prediksi keberhasilan belajar siswa menggunakan algoritma Random Forest.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Deskripsi Proyek
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-base text-gray-500">
            Aplikasi Prediksi Keberhasilan Belajar Siswa adalah sebuah sistem yang dirancang untuk membantu institusi pendidikan dalam mengidentifikasi siswa yang berisiko mengalami kegagalan akademik. 
            Dengan menggunakan algoritma Random Forest, aplikasi ini dapat menganalisis berbagai faktor yang mempengaruhi keberhasilan belajar siswa dan memberikan prediksi akurat tentang 
            kemungkinan kesuksesan atau kegagalan mereka dalam pembelajaran.
          </p>
          <p className="mt-4 text-base text-gray-500">
            Aplikasi ini juga dilengkapi dengan dashboard visualisasi data yang komprehensif, 
            memungkinkan guru dan administrator untuk memantau kinerja siswa secara real-time dan mengidentifikasi tren serta pola 
            yang mungkin memerlukan perhatian khusus. Selain itu, aplikasi ini juga memberikan rekomendasi intervensi yang dapat 
            membantu meningkatkan kinerja akademik siswa berdasarkan hasil prediksi.
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Fitur Utama
          </h2>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div key={index} className="px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Metode Random Forest
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-base text-gray-500">
            Random Forest adalah algoritma machine learning yang menggunakan pendekatan ensemble, yaitu menggabungkan beberapa model decision tree untuk meningkatkan akurasi prediksi.
            Algoritma ini bekerja dengan membangun banyak decision tree pada saat training dan mengeluarkan modus kelas (klasifikasi) atau rata-rata prediksi (regresi) dari masing-masing tree.
          </p>
          <p className="mt-4 text-base text-gray-500">
            Dalam aplikasi ini, Random Forest digunakan untuk menganalisis berbagai faktor yang mempengaruhi keberhasilan belajar siswa, seperti kehadiran, 
            waktu belajar, aktivitas ekstrakurikuler, kualitas tidur, nilai sebelumnya, tingkat motivasi, dan lainnya. 
            Berdasarkan analisis tersebut, algoritma ini mampu memberikan prediksi yang akurat mengenai kemungkinan siswa untuk berhasil atau gagal dalam pembelajaran mereka.
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Tim Pengembang
          </h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {team.map((person, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img className="h-12 w-12 rounded-full" src={person.image} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.role}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;