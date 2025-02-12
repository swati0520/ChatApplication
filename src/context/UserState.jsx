import React, { useEffect } from 'react'
import UserContext from './UserContext'
import { useState } from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const userState = (props) => {
  let url = import.meta.env.VITE_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"
  let userDetails = JSON.parse(localStorage.getItem('social'))
 const [userInfo, setuserInfo] = useState({
  login:userDetails ? userDetails.login :false,
  token:userDetails ? userDetails.token : '',
  userId:userDetails ? userDetails.userId : '',
  user:"",

});




const getUserDetails = async()=>{
  
  let res = await axios.get(url+"/users/getUser",{
    headers:{
      'Authorization':userInfo.token
      
    }
  })
  let data = res.data


  
  if(data.success){

   
    setuserInfo({...userInfo,user:data.data})
   
  }
}
useEffect(()=>{
if(userInfo.token){
  getUserDetails()
}
},[userInfo.token])

const AddUser = (ans)=>{

  const decoded = jwtDecode(ans.token);
 
  localStorage.setItem('social',JSON.stringify({login:true,token:ans.token,userId:decoded._id}))
  getUserDetails(ans.token)
setuserInfo({login:true,token:ans.token,userId:decoded._id})
}

const logout =()=>{
  localStorage.removeItem('social');
  setuserInfo({login:false,userId:"",token:""});
}
  return (
    <UserContext.Provider value={{userInfo,AddUser,logout,getUserDetails}}>
        {props.children}
    </UserContext.Provider>
  )
}

export default userState