
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import { useContext } from 'react'
import UserContext from './context/userContext'
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from './pages/ForgetPassword'
import Profile from './pages/Profile'
import FriendProfile from './pages/FriendProfile'
import Message from './pages/Message'
import Setting from './pages/Setting'
import About from './pages/About'
import Reels from './pages/Reels'
import MorePage from './pages/MorePage'
import HelpPage from './pages/HelpPage'

function App() {

  let userCtx = useContext(UserContext)
 
 let login = userCtx.userInfo.login
  
 return (
<BrowserRouter>
<div className='mb-[75px]'>
<Navbar />
</div>
<Routes>
<Route path='/' element ={login === true?<Home /> : <Navigate to = "/login"/>} />
<Route path='/login' element ={login === false?<Login /> : <Navigate to ="/"/>} />
<Route path='/register' element ={login === false?<Signup /> :<Navigate to ="/"/> }  />
<Route path='/forgetpassword' element= {<ForgetPassword/>}/>
<Route path='/profile' element= {<Profile/>}/>
<Route path='/friendProfile' element= {<FriendProfile/>}/>
<Route path='/setting' element= {<Setting/>}/>
<Route path='/message' element= {<Message/>}/>
<Route path='/About' element= {<About/>}/>
<Route path='/reels' element= {<Reels/>}/>
<Route path='/more' element= {<MorePage/>}/>
<Route path='/help' element= {<HelpPage/>}/>

</Routes>
<ToastContainer />
</BrowserRouter>
  )
}

export default App
