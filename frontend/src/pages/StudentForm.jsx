import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { studentService } from '../services/api';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { HiOutlineArrowLeft, HiOutlinePhotograph } from 'react-icons/hi';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Nama minimal 3 karakter')
      .max(50, 'Nama maksimal 50 karakter')
      .required('Nama siswa diperlukan'),
    studentId: Yup.string()
      .min(3, 'ID Siswa minimal 3 karakter')
      .max(20, 'ID Siswa maksimal 20 karakter')
      .required('ID Siswa diperlukan'),
    gender: Yup.string()
      .oneOf(['male', 'female'], 'Pilih jenis kelamin yang valid')
      .required('Jenis kelamin diperlukan'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Tanggal lahir tidak boleh di masa depan')
      .required('Tanggal lahir diperlukan'),
    grade: Yup.string().required('Tingkat kelas diperlukan'),
    class: Yup.string().required('Kelas diperlukan'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      studentId: '',
      gender: '',
      dateOfBirth: '',
      grade: '',
      class: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });

        if (selectedPhoto) {
          formData.append('photo', selectedPhoto);
        }

        if (isEdit) {
          await studentService.updateStudent(id, formData);
          setSuccess('Data siswa berhasil diperbarui!');
        } else {
          await studentService.createStudent(formData);
          setSuccess('Data siswa berhasil ditambahkan!');
        }

        setTimeout(() => {
          navigate('/students');
        }, 2000);
      } catch (err) {
        console.error('Error saving student:', err);
        setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data siswa.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch student data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const response = await studentService.getStudentById(id);
          const student = response.data.data;
          
          formik.setValues({
            name: student.name,
            studentId: student.studentId,
            gender: student.gender,
            dateOfBirth: student.dateOfBirth,
            grade: student.grade,
            class: student.class,
          });

          if (student.photo) {
            setPhotoPreview(`${import.meta.env.VITE_API_URL}${student.photo}`);
          }
        } catch (err) {
          console.error('Error fetching student:', err);
          setError('Gagal memuat data siswa.');
        } finally {
          setLoading(false);
        }
      };

      fetchStudent();
    }
  }, [id, isEdit]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const gradeOptions = ['X', 'XI', 'XII'];
  const classOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Siswa
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit 
            ? 'Perbarui informasi data siswa.' 
            : 'Masukkan informasi lengkap siswa baru.'
          }
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Siswa
            </label>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {photoPreview ? (
                  <img
                    className="h-20 w-20 object-cover rounded-full border-2 border-gray-200"
                    src={photoPreview}
                    alt="Preview"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <HiOutlinePhotograph className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="block">
                <span className="sr-only">Pilih foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              label="Nama Lengkap"
              id="name"
              name="name"
              type="text"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />

            <FormInput
              label="ID Siswa"
              id="studentId"
              name="studentId"
              type="text"
              required
              value={formik.values.studentId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.studentId && formik.errors.studentId}
            />

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin <span className="text-danger-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  formik.touched.gender && formik.errors.gender
                    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.gender}</p>
              )}
            </div>

            <FormInput
              label="Tanggal Lahir"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            />

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat <span className="text-danger-500">*</span>
              </label>
              <select
                id="grade"
                name="grade"
                value={formik.values.grade}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  formik.touched.grade && formik.errors.grade
                    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              >
                <option value="">Pilih Tingkat</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Kelas {grade}
                  </option>
                ))}
              </select>
              {formik.touched.grade && formik.errors.grade && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.grade}</p>
              )}
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Kelas <span className="text-danger-500">*</span>
              </label>
              <select
                id="class"
                name="class"
                value={formik.values.class}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  formik.touched.class && formik.errors.class
                    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              >
                <option value="">Pilih Kelas</option>
                {classOptions.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>
              {formik.touched.class && formik.errors.class && (
                <p className="mt-1 text-sm text-danger-600">{formik.errors.class}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/students')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={!formik.isValid || loading}
            >
              {isEdit ? 'Perbarui Data' : 'Simpan Data'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;