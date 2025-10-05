import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import logo from '../assets/planit-logo.png'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../utils/api';
import Loading from '../Components/Loading';

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async () => {

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }
    
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }

    setLoading(true);

    try {
        const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
            email: formData.email,
            password: formData.password
        })

        if(res.data.token) {
          sessionStorage.setItem("authToken", res.data.token);
        }

        toast.success(res.data.message || "Logged in successfully!");
        navigate('/dashboard');
    } 
    catch (error) {
        toast.error(error.response?.data?.message || "Login failed!");        
    }
    finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]:value
    })
  }

  return (
    <>

    {loading && <Loading />}    

    <div className="h-screen w-screen flex justify-center items-center">

        <div className="w-[320px] relative flex flex-col justify-center items-center px-6 py-10 border border-gray-300 rounded-lg">    

            <div className="absolute top-0 py-4">
                <img className='w-20' src={logo} alt="" />
            </div>        

            <form className="w-full flex flex-col gap-4 mt-10">

                <h2 className='text-xl text-center font-bold mb-3'>Welcome Back!</h2>

                <div className="space-y-5">
                    <div className="relative border border-gray-300 focus-within:border-black rounded-full">
                        <label className='absolute -top-3 left-3.5 bg-white px-1 text-gray-500 text-sm' htmlFor="email">Email</label>
                        <input 
                          name='email'
                          className='w-full text-sm px-5 py-2 outline-none rounded-full'
                          id='email' 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                        />
                    </div>

                    <div className="relative border border-gray-300 focus-within:border-black rounded-full">
                        <label className='absolute -top-3 left-3.5 bg-white px-1 text-gray-500 text-sm' htmlFor="password">Password</label>
                        <input
                          name='password'
                          className='w-full text-sm px-5 py-2 outline-none rounded-full' 
                          id='password' 
                          type="password" 
                          value={formData.password}
                          onChange={handleChange}
                        />
                    </div>
                </div>

                <p className='text-right text-sm font-medium cursor-pointer'>
                    Forgot Password?
                </p>

                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className='bg-black text-sm text-white font-medium px-4 py-1.5 rounded-3xl cursor-pointer'
                >
                    Login
                </button>

                <p className='text-center text-sm mt-1'>
                    Don't have an account? 
                    <span 
                      onClick={() => navigate('/')}
                      className='font-medium cursor-pointer'
                    >
                        &nbsp; Register
                    </span>
                </p>

            </form>

        </div>

    </div>

    </>
  )
}

export default Login