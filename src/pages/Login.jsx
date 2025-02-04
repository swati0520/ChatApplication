import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';

const Login = () => {
  
let userCtx = useContext(UserContext)

let url = import.meta.env.Vite_DEPLOYMENT === 'production'? import.meta.env.VITE_ENDPOINT : "http://localhost:8092"



  let navigate = useNavigate()

    let emailRef = useRef();
    let passwordRef = useRef();


    const handleSubmit = async(e)=>{
        e.preventDefault();

        let obj = {
            email:emailRef.current.value,
            password:passwordRef.current.value
        }

       

        let res = await axios.post(url+`/users/login`,obj)

 
        if(res.data.success){
          userCtx.AddUser(res.data)

          // navigate('/')
           toast.success(res.data.msg, {position:"top-right", theme:"dark"})
      }
      else{
           toast.error(res.data.msg, {position:"top-right", theme:"colored"})
      }

  }  
  return (
    <div>
        <div className="flex items-center fixed h-[80vh] justify-center  w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: `url(https://img.freepik.com/premium-vector/welcome-brush-lettering-illustration-decoration-banner-slogan_83277-5173.jpg?w=740)`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input ref={emailRef}
            //
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="email"
              required
            />
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input ref={passwordRef}
            //
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="password"
            />
            <Link
             to="/forgetpassword"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </Link>
          </div>
          <div className="mt-8">
            <button onClick={handleSubmit}  className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
              Login
            </button>
          </div>
         
          <div className="mt-4 flex items-center w-full text-center">
            <Link
              to="/register"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <span className="text-blue-700"> Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}

export default Login




    