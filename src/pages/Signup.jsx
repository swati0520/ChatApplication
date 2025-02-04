import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer} from 'react-toastify';


const Signup = () => {
  let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"


let navigate = useNavigate()
const [userdetails,setuserdetails] = useState({
    name:"",
    email:"",
    password:""

});



const handleInputChange = (e)=>{
let value = e.target.value;
let name = e.target.name;

  setuserdetails({...userdetails,[name]:value})
}

const handleSubmit = async(e)=>{
  e.preventDefault()
 


  let res = await fetch(url+`/users/create`,{
    method:"POST",
    headers:{
      'content-type':'application/json'
    },
    body:JSON.stringify(userdetails)
  })

  let data = await res.json()
 
  if(data.success){
toast.success(data.msg ,{position:'top-center'})

navigate('/login')
  }else{

    toast.error(data.msg ,{position:'top-center'})
  }
  
  
}
  return (
    <div>
      <div className="items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-fuchsia-200 border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-fuchsia-100 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://i0.wp.com/webdevpuneet.com/wp-content/uploads/2021/05/hero-section-layout-with-spotlight-effect-and-cursor-tracking.png?fit=1560%2C878&ssl=1)`,
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className=" flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
              Sign up here
              </h1>
              <p className="text-[12px] text-gray-500">
                Hey enter your details to create your account
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input onChange={handleInputChange} name='name' className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter your name"
                />
                <input onChange={handleInputChange} 
                name='email'  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                />
            
                <input onChange={handleInputChange} 
                name='password' className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"/>

                <button onClick={handleSubmit} className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">Sign up</span>
                </button >

                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-blue-900 font-semibold">or Sign up</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup




