import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
  HiOutlineChartBar,
} from 'react-icons/hi';
import { studentService, predictionService } from '../services/api';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const PredictionForm = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validationSchema = Yup.object({
    hoursStudied: Yup.number()
      .min(0, 'Jam belajar tidak boleh negatif')
      .max(24, 'Jam belajar tidak boleh lebih dari 24 jam')
      .required('Jam belajar per hari diperlukan'),
    attendance: Yup.number()
      .min(0, 'Persentase kehadiran tidak boleh negatif')
      .max(100, 'Persentase kehadiran tidak boleh lebih dari 100%')
      .required('Persentase kehadiran diperlukan'),
    extracurricularActivities: Yup.boolean().required(),
    sleepHours: Yup.number()
      .min(0, 'Jam tidur tidak boleh negatif')
      .max(24, 'Jam tidur tidak boleh lebih dari 24 jam')
      .required('Jam tidur per hari diperlukan'),
    previousScores: Yup.number()
      .min(0, 'Nilai sebelumnya tidak boleh negatif')
      .max(100, 'Nilai sebelumnya tidak boleh lebih dari 100')
      .required('Rata-rata nilai sebelumnya diperlukan'),
    motivationLevel: Yup.number()
      .min(1, 'Tingkat motivasi minimal 1')
      .max(10, 'Tingkat motivasi maksimal 10')
      .required('Tingkat motivasi diperlukan'),
    tutoringSessions: Yup.number()
      .min(0, 'Jumlah sesi bimbingan tidak boleh negatif')
      .required('Jumlah sesi bimbingan per bulan diperlukan'),
    teacherQuality: Yup.number()
      .min(1, 'Kualitas pengajar minimal 1')
      .max(10, 'Kualitas pengajar maksimal 10')
      .required('Penilaian kualitas pengajar diperlukan'),
    physicalActivity: Yup.number()
      .min(1, 'Tingkat aktivitas fisik minimal 1')
      .max(10, 'Tingkat aktivitas fisik maksimal 10')
      .required('Tingkat aktivitas fisik diperlukan'),
    learningDisabilities: Yup.boolean().required(),
    semester: Yup.string().required('Semester diperlukan'),
    academicYear: Yup.string().required('Tahun ajaran diperlukan'),
    examScore: Yup.number()
      .min(0, 'Nilai ujian tidak boleh negatif')
      .max(100, 'Nilai ujian tidak boleh lebih dari 100')
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      hoursStudied: 4,
      attendance: 90,
      extracurricularActivities: false,
      sleepHours: 8,
      previousScores: 75,
      motivationLevel: 7,
      tutoringSessions: 2,
      teacherQuality: 8,
      physicalActivity: 6,
      learningDisabilities: false,
      semester: 'Ganjil',
      academicYear: '2024/2025',
      examScore: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError(null);

        // Validasi studentId
        if (!studentId || isNaN(parseInt(studentId))) {
          throw new Error(`Invalid student ID: ${studentId}`);
        }

        // Format data sesuai dengan yang diharapkan backend (camelCase)
        const predictionData = {
          hoursStudied: parseFloat(values.hoursStudied) || 0,
          attendance: parseFloat(values.attendance) || 0,
          extracurricularActivities: Boolean(values.extracurricularActivities),
          sleepHours: parseFloat(values.sleepHours) || 0,
          previousScores: parseFloat(values.previousScores) || 0,
          motivationLevel: parseInt(values.motivationLevel) || 1,
          tutoringSessions: parseInt(values.tutoringSessions) || 0,
          teacherQuality: parseInt(values.teacherQuality) || 1,
          physicalActivity: parseInt(values.physicalActivity) || 1,
          learningDisabilities: Boolean(values.learningDisabilities),
          semester: values.semester || 'Ganjil',
          academicYear: values.academicYear || '2024/2025',
          examScore: values.examScore && values.examScore !== '' ? parseFloat(values.examScore) : 0,
        };

        // Debug logging
        console.log('🔍 Form values original:', values);
        console.log('🔍 StudentId from params:', { studentId, type: typeof studentId, parsed: parseInt(studentId) });
        console.log('🔍 Formatted prediction data (camelCase):', predictionData);

        // Log final data yang akan dikirim
        console.log('📤 Final data to send:', JSON.stringify(predictionData, null, 2));

        // Kirim request
        console.log('📡 Sending request to:', `/api/predictions/student/${studentId}`);
        const response = await predictionService.createPrediction(studentId, predictionData);
        
        console.log('✅ Response received:', response);
        
        setSuccess('Prediksi berhasil dibuat! Anda akan diarahkan ke halaman detail siswa.');
        
        setTimeout(() => {
          navigate(`/students/${studentId}`);
        }, 2000);
        
      } catch (err) {
        console.error('❌ Complete Error Object:', err);
        
        // Log detail error untuk debugging
        if (err.response) {
          console.error('❌ Error Response Status:', err.response.status);
          console.error('❌ Error Response Headers:', err.response.headers);
          console.error('❌ Error Response Data:', err.response.data);
          console.error('❌ DETAILED ERROR MESSAGE:', JSON.stringify(err.response.data, null, 2));
        }
        
        if (err.config) {
          console.error('❌ Request Config:', {
            url: err.config.url,
            method: err.config.method,
            headers: err.config.headers,
            data: err.config.data,
          });
        }
        
        if (err.request) {
          console.error('❌ Request Object:', err.request);
        }
        
        console.error('❌ Error Message:', err.message);
        console.error('❌ Error Stack:', err.stack);
        
        let errorMessage = 'Terjadi kesalahan saat membuat prediksi.';
        
        if (err.response?.status === 400) {
          console.error('❌ Bad Request (400) Details:', {
            url: err.config?.url,
            method: err.config?.method,
            sentData: err.config?.data ? JSON.parse(err.config.data) : 'No data',
            serverResponse: err.response?.data,
            headers: err.config?.headers
          });
          
          if (err.response?.data?.message) {
            errorMessage = `Kesalahan input: ${err.response.data.message}`;
          } else if (err.response?.data?.errors) {
            const validationErrors = Array.isArray(err.response.data.errors) 
              ? err.response.data.errors 
              : Object.values(err.response.data.errors).flat();
            errorMessage = `Kesalahan validasi: ${validationErrors.join(', ')}`;
          } else if (err.response?.data?.error) {
            errorMessage = `Server error: ${err.response.data.error}`;
          } else {
            errorMessage = `Bad Request: Data yang dikirim tidak valid. Detail: ${JSON.stringify(err.response.data)}`;
          }
        } else if (err.response?.status === 401) {
          errorMessage = 'Anda tidak memiliki akses. Silakan login kembali.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Siswa tidak ditemukan.';
        } else if (err.response?.status === 422) {
          errorMessage = 'Data tidak valid. Periksa kembali semua field yang diisi.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
        } else if (!err.response) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        }
        
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!studentId || isNaN(parseInt(studentId))) {
          throw new Error('ID siswa tidak valid');
        }
        
        console.log('🔍 Fetching student with ID:', studentId);
        const response = await studentService.getStudentById(studentId);
        console.log('✅ Student data received:', response.data);
        
        setStudent(response.data.data || response.data);
      } catch (err) {
        console.error('❌ Error fetching student:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Gagal memuat data siswa.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    } else {
      setError('ID siswa tidak ditemukan');
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return <Loading size="lg" text="Memuat data siswa..." fullScreen />;
  }

  if (error && !student) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert type="error" message={error} />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate('/students')}>
            Kembali ke Daftar Siswa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/students/${studentId}`)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Siswa
        </button>
        
        <div className="flex items-center">
          <HiOutlineChartBar className="mr-3 h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Buat Prediksi Keberhasilan Belajar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Untuk siswa: <strong>{student?.name || 'Loading...'}</strong> 
              {student?.studentId && ` (${student.studentId})`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} />
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md">
          <details>
            <summary className="cursor-pointer text-sm font-medium">🔍 Debug Info (Development Only)</summary>
            <div className="mt-2 space-y-2">
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Student ID:</strong> {studentId} (type: {typeof studentId})
              </div>
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Student Data:</strong>
                <pre className="mt-1">{JSON.stringify(student, null, 2)}</pre>
              </div>
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Current Form Values:</strong>
                <pre className="mt-1">{JSON.stringify(formik.values, null, 2)}</pre>
              </div>
              <div className="text-xs bg-white p-2 rounded border">
                <strong>Form Errors:</strong>
                <pre className="mt-1">{JSON.stringify(formik.errors, null, 2)}</pre>
              </div>
            </div>
          </details>
        </div>
      )} */}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Academic Information */}
        <Card title="Informasi Akademik">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                Semester <span className="text-danger-500">*</span>
              </label>
              <select
                id="semester"
                name="semester"
                value={formik.values.semester}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              {formik.touched.semester && formik.errors.semester && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.semester}</p>
              )}
            </div>

            <FormInput
              label="Tahun Ajaran"
              id="academicYear"
              name="academicYear"
              placeholder="2024/2025"
              required
              value={formik.values.academicYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.academicYear && formik.errors.academicYear}
            />

            <FormInput
              label="Rata-rata Nilai Sebelumnya"
              id="previousScores"
              name="previousScores"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={formik.values.previousScores}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.previousScores && formik.errors.previousScores}
            />

            <FormInput
              label="Nilai Ujian (Opsional)"
              id="examScore"
              name="examScore"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="Kosongkan jika belum ada"
              value={formik.values.examScore}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.examScore && formik.errors.examScore}
            />
          </div>
        </Card>

        {/* Study Habits */}
        <Card title="Kebiasaan Belajar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Jam Belajar per Hari"
              id="hoursStudied"
              name="hoursStudied"
              type="number"
              min="0"
              max="24"
              step="0.5"
              required
              value={formik.values.hoursStudied}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.hoursStudied && formik.errors.hoursStudied}
            />

            <FormInput
              label="Persentase Kehadiran (%)"
              id="attendance"
              name="attendance"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={formik.values.attendance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.attendance && formik.errors.attendance}
            />

            <FormInput
              label="Jam Tidur per Hari"
              id="sleepHours"
              name="sleepHours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              required
              value={formik.values.sleepHours}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sleepHours && formik.errors.sleepHours}
            />

            <FormInput
              label="Sesi Bimbingan per Bulan"
              id="tutoringSessions"
              name="tutoringSessions"
              type="number"
              min="0"
              required
              value={formik.values.tutoringSessions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tutoringSessions && formik.errors.tutoringSessions}
            />
          </div>
        </Card>

        {/* Personal Factors */}
        <Card title="Faktor Personal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat Motivasi <span className="text-danger-500">*</span>
              </label>
              <select
                name="motivationLevel"
                value={formik.values.motivationLevel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} - {i < 3 ? 'Rendah' : i < 7 ? 'Sedang' : 'Tinggi'}
                  </option>
                ))}
              </select>
              {formik.touched.motivationLevel && formik.errors.motivationLevel && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.motivationLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat Aktivitas Fisik <span className="text-danger-500">*</span>
              </label>
              <select
                name="physicalActivity"
                value={formik.values.physicalActivity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} - {i < 3 ? 'Rendah' : i < 7 ? 'Sedang' : 'Tinggi'}
                  </option>
                ))}
              </select>
              {formik.touched.physicalActivity && formik.errors.physicalActivity && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.physicalActivity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kualitas Pengajar <span className="text-danger-500">*</span>
              </label>
              <select
                name="teacherQuality"
                value={formik.values.teacherQuality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} - {i < 3 ? 'Kurang' : i < 7 ? 'Baik' : 'Sangat Baik'}
                  </option>
                ))}
              </select>
              {formik.touched.teacherQuality && formik.errors.teacherQuality && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.teacherQuality}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Aktivitas Ekstrakurikuler <span className="text-danger-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="extracurricularActivities"
                    value="true"
                    checked={formik.values.extracurricularActivities === true}
                    onChange={() => formik.setFieldValue('extracurricularActivities', true)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ya, aktif</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="extracurricularActivities"
                    value="false"
                    checked={formik.values.extracurricularActivities === false}
                    onChange={() => formik.setFieldValue('extracurricularActivities', false)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tidak aktif</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kesulitan Belajar <span className="text-danger-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="learningDisabilities"
                    value="true"
                    checked={formik.values.learningDisabilities === true}
                    onChange={() => formik.setFieldValue('learningDisabilities', true)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ya, ada</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="learningDisabilities"
                    value="false"
                    checked={formik.values.learningDisabilities === false}
                    onChange={() => formik.setFieldValue('learningDisabilities', false)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tidak ada</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Information Note */}
        <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiOutlineInformationCircle className="h-5 w-5 text-primary-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-800">
                Tentang Prediksi Keberhasilan Belajar
              </h3>
              <div className="mt-2 text-sm text-primary-700">
                <p>
                  Sistem akan menganalisis berbagai faktor yang Anda masukkan menggunakan algoritma Random Forest 
                  untuk memprediksi kemungkinan keberhasilan belajar siswa. Hasil prediksi akan menunjukkan:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Berhasil:</strong> Siswa diprediksi akan berhasil dalam pembelajaran</li>
                  <li><strong>Berisiko:</strong> Siswa memiliki risiko mengalami kesulitan dan perlu perhatian ekstra</li>
                  <li><strong>Gagal:</strong> Siswa berisiko tinggi gagal dan membutuhkan intervensi segera</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/students/${studentId}`)}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={submitting}
            disabled={!formik.isValid || submitting}
          >
            {submitting ? 'Membuat Prediksi...' : 'Buat Prediksi'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;