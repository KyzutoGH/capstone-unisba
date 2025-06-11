import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HiOutlineHome },
    { name: 'Siswa', to: '/students', icon: HiOutlineUserGroup },
    { name: 'Profil', to: '/profile', icon: HiOutlineUser },
    { name: 'Tentang', to: '/about', icon: HiOutlineInformationCircle },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'fixed inset-0 z-40 lg:hidden' : 'hidden'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      </div>

      <div
        className={`fixed inset-0 flex z-40 lg:hidden transition-opacity duration-300 ease-linear ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-700">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <HiOutlineX className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <img
              className="h-8 w-auto"
              src="/research.png"
              alt="EduPredict"
            />
            <h1 className="ml-2 text-white font-bold text-lg">EduPredict</h1>
          </div>

          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-800 text-white'
                        : 'text-white hover:bg-primary-600 hover:bg-opacity-75'
                    }`
                  }
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-primary-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-primary-600 hover:bg-opacity-75"
              >
                <HiOutlineLogout
                  className="mr-4 flex-shrink-0 h-6 w-6 text-primary-300"
                  aria-hidden="true"
                />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-700">
              <img
                className="h-8 w-auto filter invert"
                src="/research.png"
                alt="EduPredict"
              />
              <h1 className="ml-2 text-white font-bold text-lg">EduPredict</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-primary-700">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-800 text-white'
                          : 'text-white hover:bg-primary-600 hover:bg-opacity-75'
                      }`
                    }
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-primary-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-primary-600 hover:bg-opacity-75"
                >
                  <HiOutlineLogout
                    className="mr-3 flex-shrink-0 h-6 w-6 text-primary-300"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <HiOutlineMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Aplikasi Prediksi Keberhasilan Belajar Siswa
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium leading-none text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </span>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;