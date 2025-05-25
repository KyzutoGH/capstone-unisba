import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import { studentService } from '../services/api';
import StudentCard from '../components/student/StudentCard';
import StudentFilter from '../components/student/StudentFilter';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    grade: '',
    class: '',
    sort: 'name',
    order: 'ASC',
    page: 1,
    limit: 12,
  });

  // Grade and class options for filter
  const gradeOptions = ['X', 'XI', 'XII'];
  const classOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Memoize filters untuk mencegah infinite loop
  const memoizedFilters = useMemo(() => filters, [
    filters.search,
    filters.grade,
    filters.class,
    filters.sort,
    filters.order,
    filters.page,
    filters.limit
  ]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add retry logic for network errors
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const response = await studentService.getAllStudents(memoizedFilters);
          setStudents(response.data.data.students);
          setPagination(response.data.data.pagination);
          setError(null);
          return; // Success, exit retry loop
        } catch (err) {
          retryCount++;
          
          if (err.code === 'ERR_NETWORK' && retryCount < maxRetries) {
            console.log(`Network error, retrying... (${retryCount}/${maxRetries})`);
            // Exponential backoff dengan delay lebih lama
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); 
            continue;
          }
          
          throw err; // Re-throw if not network error or max retries reached
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      
      let errorMessage = 'Gagal memuat data siswa. Silakan coba lagi nanti.';
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend sedang berjalan dan tutup tab browser yang tidak perlu.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setStudents([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]); // Gunakan memoized filters

  // Debounce effect untuk mencegah terlalu banyak request
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 300); // Delay 300ms

    return () => clearTimeout(timeoutId);
  }, [fetchStudents]);

  const handleFilter = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Reset to first page when filtering
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
    }));
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      return;
    }

    try {
      await studentService.deleteStudent(studentId);
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Gagal menghapus data siswa. Silakan coba lagi.');
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Data Siswa</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data siswa dan buat prediksi keberhasilan belajar mereka.
            </p>
          </div>
          <Link to="/students/add">
            <Button variant="primary">
              <HiOutlinePlus className="mr-2 h-5 w-5" />
              Tambah Siswa
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <StudentFilter
        onFilter={handleFilter}
        gradeOptions={gradeOptions}
        classOptions={classOptions}
      />

      {students.length === 0 && !loading ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada siswa</h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai dengan menambahkan siswa baru ke dalam sistem.
          </p>
          <div className="mt-6">
            <Link to="/students/add">
              <Button variant="primary">
                <HiOutlinePlus className="mr-2 h-5 w-5" />
                Tambah Siswa
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Students;