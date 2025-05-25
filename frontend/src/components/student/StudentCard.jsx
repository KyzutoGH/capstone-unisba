import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineUserCircle, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const StudentCard = ({ student, onDelete }) => {
  if (!student) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          {student.photo ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${student.photo}`}
              alt={student.name}
              className="rounded-full w-full h-full object-cover border-4 border-primary-100"
            />
          ) : (
            <div className="rounded-full w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
              <HiOutlineUserCircle className="w-16 h-16" />
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">ID: {student.studentId}</p>
          <div className="mt-1 flex items-center justify-center space-x-1">
            <HiOutlineAcademicCap className="text-primary-600" />
            <span className="text-sm text-gray-600">
              Kelas {student.grade} - {student.class}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/students/${student.id}`}
            className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
          >
            Detail
          </Link>
          <Link
            to={`/students/${student.id}/predict`}
            className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-medium rounded-md text-success-700 bg-success-100 hover:bg-success-200"
          >
            Prediksi
          </Link>
          <Link
            to={`/students/${student.id}/edit`}
            className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-medium rounded-md text-warning-700 bg-warning-100 hover:bg-warning-200"
          >
            <HiOutlinePencilAlt className="mr-1" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(student.id)}
            className="inline-flex justify-center items-center px-3 py-1.5 text-xs font-medium rounded-md text-danger-700 bg-danger-100 hover:bg-danger-200"
          >
            <HiOutlineTrash className="mr-1" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;