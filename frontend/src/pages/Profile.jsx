// import { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { HiOutlineUser, HiOutlineLockClosed, HiOutlinePhotograph } from 'react-icons/hi';
// import { useAuth } from '../contexts/AuthContext';
// import Card from '../components/common/Card';
// import FormInput from '../components/common/FormInput';
// import Button from '../components/common/Button';
// import Alert from '../components/common/Alert';

// const Profile = () => {
//   const { user, updateProfile, changePassword } = useAuth();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [selectedPhoto, setSelectedPhoto] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [profileSuccess, setProfileSuccess] = useState(null);
//   const [passwordSuccess, setPasswordSuccess] = useState(null);
//   const [profileError, setProfileError] = useState(null);
//   const [passwordError, setPasswordError] = useState(null);

//   // Profile form validation
//   const profileValidationSchema = Yup.object({
//     name: Yup.string()
//       .min(3, 'Nama minimal 3 karakter')
//       .max(50, 'Nama maksimal 50 karakter')
//       .required('Nama diperlukan'),
//     email: Yup.string()
//       .email('Format email tidak valid')
//       .required('Email diperlukan'),
//   });

//   // Password form validation
//   const passwordValidationSchema = Yup.object({
//     currentPassword: Yup.string().required('Password saat ini diperlukan'),
//     newPassword: Yup.string()
//       .min(6, 'Password baru minimal 6 karakter')
//       .required('Password baru diperlukan'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('newPassword'), null], 'Konfirmasi password tidak cocok')
//       .required('Konfirmasi password diperlukan'),
//   });

//   // Profile form
//   const profileFormik = useFormik({
//     initialValues: {
//       name: user?.name || '',
//       email: user?.email || '',
//     },
//     validationSchema: profileValidationSchema,
//     onSubmit: async (values) => {
//       try {
//         setProfileLoading(true);
//         setProfileError(null);

//         await updateProfile(values, selectedPhoto);
//         setProfileSuccess('Profil berhasil diperbarui!');
//         setSelectedPhoto(null);
//         setPhotoPreview(null);
//       } catch (error) {
//         setProfileError('Gagal memperbarui profil. Silakan coba lagi.');
//       } finally {
//         setProfileLoading(false);
//       }
//     },
//   });

//   // Password form
//   const passwordFormik = useFormik({
//     initialValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     },
//     validationSchema: passwordValidationSchema,
//     onSubmit: async (values) => {
//       try {
//         setPasswordLoading(true);
//         setPasswordError(null);

//         await changePassword(values.currentPassword, values.newPassword);
//         setPasswordSuccess('Password berhasil diubah!');
//         passwordFormik.resetForm();
//       } catch (error) {
//         setPasswordError('Gagal mengubah password. Periksa password saat ini Anda.');
//       } finally {
//         setPasswordLoading(false);
//       }
//     },
//   });

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedPhoto(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const tabs = [
//     { id: 'profile', name: 'Profil', icon: HiOutlineUser },
//     { id: 'password', name: 'Ubah Password', icon: HiOutlineLockClosed },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Pengaturan Profil</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Kelola informasi profil dan keamanan akun Anda
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar Navigation */}
//         <div className="lg:col-span-1">
//           <nav className="space-y-1">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                   activeTab === tab.id
//                     ? 'bg-primary-100 text-primary-700 border-primary-300'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <tab.icon className="mr-3 h-5 w-5" />
//                 {tab.name}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-3">
//           {activeTab === 'profile' && (
//             <Card title="Informasi Profil">
//               {profileSuccess && (
//                 <div className="mb-6">
//                   <Alert
//                     type="success"
//                     message={profileSuccess}
//                     onClose={() => setProfileSuccess(null)}
//                   />
//                 </div>
//               )}

//               {profileError && (
//                 <div className="mb-6">
//                   <Alert
//                     type="error"
//                     message={profileError}
//                     onClose={() => setProfileError(null)}
//                   />
//                 </div>
//               )}

//               <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
//                 {/* Profile Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Foto Profil
//                   </label>
//                   <div className="flex items-center space-x-6">
//                     <div className="shrink-0">
//                       {photoPreview ? (
//                         <img
//                           className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
//                           src={photoPreview}
//                           alt="Preview"
//                         />
//                       ) : user?.profilePicture ? (
//                         <img
//                           className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
//                           src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
//                           alt="Profile"
//                         />
//                       ) : (
//                         <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
//                           <HiOutlinePhotograph className="h-8 w-8 text-primary-600" />
//                         </div>
//                       )}
//                     </div>
//                     <label className="block">
//                       <span className="sr-only">Pilih foto</span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handlePhotoChange}
//                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
//                       />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Form Fields */}
//                 <div className="grid grid-cols-1 gap-6">
//                   <FormInput
//                     label="Nama Lengkap"
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={profileFormik.values.name}
//                     onChange={profileFormik.handleChange}
//                     onBlur={profileFormik.handleBlur}
//                     error={profileFormik.touched.name && profileFormik.errors.name}
//                   />

//                   <FormInput
//                     label="Email"
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     value={profileFormik.values.email}
//                     onChange={profileFormik.handleChange}
//                     onBlur={profileFormik.handleBlur}
//                     error={profileFormik.touched.email && profileFormik.errors.email}
//                   />

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Role
//                     </label>
//                     <div className="mt-1">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
//                         {user?.role === 'admin' ? 'Administrator' : 'Guru'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     isLoading={profileLoading}
//                     disabled={!profileFormik.isValid || profileLoading}
//                   >
//                     Simpan Perubahan
//                   </Button>
//                 </div>
//               </form>
//             </Card>
//           )}

//           {activeTab === 'password' && (
//             <Card title="Ubah Password">
//               {passwordSuccess && (
//                 <div className="mb-6">
//                   <Alert
//                     type="success"
//                     message={passwordSuccess}
//                     onClose={() => setPasswordSuccess(null)}
//                   />
//                 </div>
//               )}

//               {passwordError && (
//                 <div className="mb-6">
//                   <Alert
//                     type="error"
//                     message={passwordError}
//                     onClose={() => setPasswordError(null)}
//                   />
//                 </div>
//               )}

//               <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
//                 <FormInput
//                   label="Password Saat Ini"
//                   id="currentPassword"
//                   name="currentPassword"
//                   type="password"
//                   required
//                   value={passwordFormik.values.currentPassword}
//                   onChange={passwordFormik.handleChange}
//                   onBlur={passwordFormik.handleBlur}
//                   error={
//                     passwordFormik.touched.currentPassword &&
//                     passwordFormik.errors.currentPassword
//                   }
//                 />

//                 <FormInput
//                   label="Password Baru"
//                   id="newPassword"
//                   name="newPassword"
//                   type="password"
//                   required
//                   value={passwordFormik.values.newPassword}
//                   onChange={passwordFormik.handleChange}
//                   onBlur={passwordFormik.handleBlur}
//                   error={
//                     passwordFormik.touched.newPassword &&
//                     passwordFormik.errors.newPassword
//                   }
//                 />

//                 <FormInput
//                   label="Konfirmasi Password Baru"
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   value={passwordFormik.values.confirmPassword}
//                   onChange={passwordFormik.handleChange}
//                   onBlur={passwordFormik.handleBlur}
//                   error={
//                     passwordFormik.touched.confirmPassword &&
//                     passwordFormik.errors.confirmPassword
//                   }
//                 />

//                 <div className="bg-warning-50 border border-warning-200 rounded-md p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-warning-800">
//                         Tips Keamanan Password
//                       </h3>
//                       <div className="mt-2 text-sm text-warning-700">
//                         <ul className="list-disc pl-5 space-y-1">
//                           <li>Gunakan minimal 8 karakter</li>
//                           <li>Kombinasikan huruf besar, huruf kecil, dan angka</li>
//                           <li>Hindari menggunakan informasi personal</li>
//                           <li>Jangan gunakan password yang sama dengan akun lain</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     isLoading={passwordLoading}
//                     disabled={!passwordFormik.isValid || passwordLoading}
//                   >
//                     Ubah Password
//                   </Button>
//                 </div>
//               </form>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlinePhotograph } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Profile form validation
  const profileValidationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Nama minimal 3 karakter')
      .max(50, 'Nama maksimal 50 karakter')
      .required('Nama diperlukan'),
    email: Yup.string()
      .email('Format email tidak valid')
      .required('Email diperlukan'),
  });

  // Password form validation
  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Password saat ini diperlukan'),
    newPassword: Yup.string()
      .min(6, 'Password baru minimal 6 karakter')
      .required('Password baru diperlukan'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Konfirmasi password tidak cocok')
      .required('Konfirmasi password diperlukan'),
  });

  // Profile form
  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true, // Add this to reinitialize when user data changes
    onSubmit: async (values) => {
      try {
        setProfileLoading(true);
        setProfileError(null);

        await updateProfile(values, selectedPhoto);
        setProfileSuccess('Profil berhasil diperbarui!');
        setSelectedPhoto(null);
        setPhotoPreview(null);
      } catch (error) {
        console.error('Profile update error:', error);
        setProfileError('Gagal memperbarui profil. Silakan coba lagi.');
      } finally {
        setProfileLoading(false);
      }
    },
  });

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      try {
        setPasswordLoading(true);
        setPasswordError(null);

        await changePassword(values.currentPassword, values.newPassword);
        setPasswordSuccess('Password berhasil diubah!');
        passwordFormik.resetForm();
      } catch (error) {
        console.error('Password change error:', error);
        setPasswordError('Gagal mengubah password. Periksa password saat ini Anda.');
      } finally {
        setPasswordLoading(false);
      }
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setProfileError('Silakan pilih file gambar yang valid.');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }

      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: HiOutlineUser },
    { id: 'password', name: 'Ubah Password', icon: HiOutlineLockClosed },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan Profil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola informasi profil dan keamanan akun Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card title="Informasi Profil">
              {profileSuccess && (
                <div className="mb-6">
                  <Alert
                    type="success"
                    message={profileSuccess}
                    onClose={() => setProfileSuccess(null)}
                  />
                </div>
              )}

              {profileError && (
                <div className="mb-6">
                  <Alert
                    type="error"
                    message={profileError}
                    onClose={() => setProfileError(null)}
                  />
                </div>
              )}

              <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                      {photoPreview ? (
                        <img
                          className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
                          src={photoPreview}
                          alt="Preview"
                        />
                      ) : user?.profilePicture ? (
                        <img
                          className="h-16 w-16 object-cover rounded-full border-2 border-gray-200"
                          src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                          <HiOutlinePhotograph className="h-8 w-8 text-primary-600" />
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

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <FormInput
                    label="Nama Lengkap"
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={profileFormik.values.name}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={profileFormik.touched.name && profileFormik.errors.name}
                  />

                  <FormInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={profileFormik.values.email}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={profileFormik.touched.email && profileFormik.errors.email}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {user?.role === 'admin' ? 'Administrator' : 'Guru'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={profileLoading}
                    disabled={!profileFormik.isValid || profileLoading}
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card title="Ubah Password">
              {passwordSuccess && (
                <div className="mb-6">
                  <Alert
                    type="success"
                    message={passwordSuccess}
                    onClose={() => setPasswordSuccess(null)}
                  />
                </div>
              )}

              {passwordError && (
                <div className="mb-6">
                  <Alert
                    type="error"
                    message={passwordError}
                    onClose={() => setPasswordError(null)}
                  />
                </div>
              )}

              <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                <FormInput
                  label="Password Saat Ini"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={
                    passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword
                  }
                />

                <FormInput
                  label="Password Baru"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={
                    passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword
                  }
                />

                <FormInput
                  label="Konfirmasi Password Baru"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={
                    passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword
                  }
                />

                <div className="bg-warning-50 border border-warning-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-warning-800">
                        Tips Keamanan Password
                      </h3>
                      <div className="mt-2 text-sm text-warning-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Gunakan minimal 8 karakter</li>
                          <li>Kombinasikan huruf besar, huruf kecil, dan angka</li>
                          <li>Hindari menggunakan informasi personal</li>
                          <li>Jangan gunakan password yang sama dengan akun lain</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={passwordLoading}
                    disabled={!passwordFormik.isValid || passwordLoading}
                  >
                    Ubah Password
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;