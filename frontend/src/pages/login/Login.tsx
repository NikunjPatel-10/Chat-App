import { Formik, ErrorMessage, Field, Form } from "formik";
import { useState } from "react";
import {  FiEyeOff, FiEye } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ILoginForm } from "../../core/utility/models/login.model";
import { useLoginUserMutation } from "../../core/utility/services/auth-service";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

    const handleSubmit = async (values:ILoginForm) => {

     try {
      const response = await loginUser(values);
      
      
      if(response){
        console.log(response.data);
          const { accessToken, refreshToken} = response.data;
          

          // Store token in local storage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
            // Decode token to get user data
        const decodedToken: any = jwtDecode(accessToken);
        console.log(decodedToken);
        console.log(decodedToken);
        
        

        // // Store user data in local storage
        localStorage.setItem("userId", decodedToken._id);

          navigate('/home')

      }
     }
     catch(error:any){
      console.error("Login error", error);
     }
    };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Welcome to Chat App
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
            <Form>
            
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
                Login
              </button>
            </Form>
        </Formik>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/registration" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
