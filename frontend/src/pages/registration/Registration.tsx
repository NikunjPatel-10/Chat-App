import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import { useSignUpSubmitMutation } from '../../core/utility/services/auth-service';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../../shared/utility/helpers/uploadFile';

const Registration = () => {
  const [profileImagePreview, setProfileImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const naviagte = useNavigate()
const [signUpSubmit] = useSignUpSubmitMutation()
  const initialValues = {
    name: '',
    email: '',
    password: '',
    profilePicture: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    profilePicture: Yup.mixed().required('Profile picture is required'),
  });

  const handleSubmit = async (values: any) => {
    // Handle form submission
  await  signUpSubmit(values)
  naviagte('/login')
    console.log(values);
  };

  const handleImageChange = async(event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.target.files?.[0];

    const uploadImage = await uploadFile(file)

    console.log(uploadImage);
    

    if (file) {
      setFieldValue('profilePicture', uploadImage?.url);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='bg-white w-full max-w-md rounded shadow-lg p-6'>
        <h2 className='text-3xl font-bold text-center mb-6 text-indigo-600'>Join Chat App</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className='mb-4 text-center relative'>
                <label htmlFor='profilePicture' className='block text-sm font-medium mb-1 text-gray-700'>
                  Profile Picture
                </label>
                <div className='flex justify-center items-center'>
                  <div className='relative'>
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview.toString()}
                        alt='Profile'
                        className='w-24 h-24 rounded-full object-cover border-2 border-gray-300'
                      />
                    ) : (
                      <FaCircleUser className='w-24 h-24 text-gray-400' />
                    )}
                    <label
                      htmlFor='profilePicture'
                      className='absolute bottom-[5%] right-[7%] bg-indigo-600 text-white rounded-full p-1 cursor-pointer hover:bg-indigo-700'
                    >
                      <FiPlus size={18} />
                    </label>
                  </div>
                  <input
                    id='profilePicture'
                    name='profilePicture'
                    type='file'
                    className='hidden'
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                    accept='image/*'
                  />
                </div>
                <ErrorMessage name='profilePicture' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-1 text-gray-700'>
                  Name
                </label>
                <Field
                  type='text'
                  id='name'
                  name='name'
                  className='w-full bg-gray-50 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                <ErrorMessage name='name' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <div className='mb-4'>
                <label htmlFor='email' className='block text-sm font-medium mb-1 text-gray-700'>
                  Email
                </label>
                <Field
                  type='email'
                  id='email'
                  name='email'
                  className='w-full bg-gray-50 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <div className='mb-4 relative'>
                <label htmlFor='password' className='block text-sm font-medium mb-1 text-gray-700'>
                  Password
                </label>
                <div className='relative'>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    className='w-full bg-gray-50 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                  <div
                    className='absolute inset-y-0 right-3 flex items-center cursor-pointer'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </div>
                </div>
                <ErrorMessage name='password' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <button
                type='submit'
                className='bg-indigo-600 text-white rounded-full py-2 w-full font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        <p className='mt-4 text-center text-sm text-gray-600'>
          Already have an account? <Link to='/login' className='text-indigo-600 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
