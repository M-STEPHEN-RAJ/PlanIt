import React, { useState } from 'react'
import axios from "axios";
import { toast } from 'react-hot-toast';
import logo from '../assets/planit-logo.png'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../utils/api';

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false
  })

  const handelSignUp = async () => {

    if (!formData.name.trim()) {
      return toast.error("Name is required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Enter a valid email address");
    }

    if (!formData.password || formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (!formData.terms) {
      return toast.error("Please agree to terms & conditions");
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      sessionStorage.setItem("authToken", res.data.token);

      toast.success("User signed up successfully!");

      navigate('/dashboard');
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <>

    <div className="h-screen w-screen flex justify-center items-center">

        <div className="w-[320px] relative flex flex-col justify-center items-center px-6 py-10 border border-gray-300 rounded-lg">    

            <div className="absolute top-0 py-4">
                <img className='w-20' src={logo} alt="" />
            </div>        

            <form className="w-full flex flex-col gap-4 mt-10">

                <h2 className='text-xl text-center font-bold mb-3'>Create Your Account</h2>

                <div className="space-y-5">

                  <div className="relative border border-gray-300 focus-within:border-black rounded-full">
                      <label className='absolute -top-3 left-3.5 bg-white px-1 text-gray-500 text-sm' htmlFor="name">
                        Name
                      </label>
                      <input 
                        className='w-full px-5 py-1.5 text-sm rounded-full outline-none'
                        name='name'
                        id='name' 
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                      />
                  </div>

                  <div className="relative border border-gray-300 focus-within:border-black rounded-full">
                      <label className='absolute -top-3 left-3.5 bg-white px-1 text-gray-500 text-sm' htmlFor="email">Email</label>
                      <input
                        className='w-full px-5 py-1.5 text-sm rounded-full outline-none'
                        name='email'
                        id='email'  
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                  </div>

                  <div className="relative border border-gray-300 focus-within:border-black rounded-full">
                      <label className='absolute -top-3 left-3.5 bg-white px-1 text-gray-500 text-sm' htmlFor="password">Password</label>
                      <input 
                        className='w-full px-5 py-1.5 text-sm rounded-full outline-none' 
                        name='password'
                        id='password'  
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                  </div>

                </div>

                <div className="flex gap-3 px-3">
                    <input 
                      name="terms" 
                      id='terms' 
                      className='accent-black' 
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleChange}
                    />
                    <label htmlFor='terms' className='text-sm cursor-pointer'>I agree to terms & conditions</label>
                </div>

                <button
                  type="button"
                  onClick={() => handelSignUp()}
                  className='bg-black text-sm text-white font-medium px-4 py-1.5 rounded-3xl cursor-pointer'
                >
                    Sign Up
                </button>

                <p className='text-center text-sm mt-1'>
                    Already have an account?
                    <span 
                      onClick={() => navigate('/login')}
                      className='font-medium text-sm cursor-pointer'
                    >
                        &nbsp; Login
                    </span>
                </p>

            </form>

        </div>

    </div>

    </>    
  )
}

export default SignUp