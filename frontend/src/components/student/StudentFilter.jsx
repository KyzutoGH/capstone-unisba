import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const StudentFilter = ({ onFilter, gradeOptions, classOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    class: '',
    sort: 'name',
    order: 'ASC',
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      grade: '',
      class: '',
      sort: 'name',
      order: 'ASC',
    });
    onFilter({
      search: '',
      grade: '',
      class: '',
      sort: 'name',
      order: 'ASC',
    });
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search input */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Cari nama atau ID siswa"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Filter button */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
            Filter
          </button>

          {/* Sort dropdown */}
          <div className="ml-4">
            <label htmlFor="sort" className="sr-only">
              Urutkan berdasarkan
            </label>
            <div className="flex items-center">
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="name">Nama</option>
                <option value="studentId">ID Siswa</option>
                <option value="grade">Kelas</option>
                <option value="createdAt">Tanggal Tambah</option>
              </select>
              <select
                name="order"
                value={filters.order}
                onChange={handleChange}
                className="ml-2 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="ASC">A-Z</option>
                <option value="DESC">Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced filter form */}
      {isOpen && (
        <div className="mt-4 bg-white p-4 shadow rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                  Kelas
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={filters.grade}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">Semua Kelas</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Kelas
                </label>
                <select
                  id="class"
                  name="class"
                  value={filters.class}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">Semua Kelas</option>
                  {classOptions.map((classItem) => (
                    <option key={classItem} value={classItem}>
                      {classItem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <HiOutlineX className="mr-2 h-5 w-5 text-gray-400" />
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Terapkan Filter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentFilter;