import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import UserContext from "../context/userContext";
import axios from "axios";

const Navbar = () => {
    let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  let userCtx = useContext(UserContext);

  let id = userCtx.userInfo.userId

  let login = userCtx.userInfo.login


  let navigate = useNavigate()
  const [friendsUser, setFrinedsUser] = useState([]);
  const handelInputChnager = async (e) => {
    let res = await axios.get(url+`/users/username?q=${e.target.value}`)
    let data = res.data
    setFrinedsUser(data);
  }

  return (
    <nav className="navbar text-white shadow-md fixed w-full  top-0 z-50">
      <div className="w-full   mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 text-black">
            <Link to="/" className="chatroom" >ChatRoom</Link>

          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-x-8">
            <div
              className="hidden md:flex items-center relative  ">
              <ul className="bg-red-300 w-full items-center  absolute top-full  ">
                {
                  friendsUser.map((friend) => {
                    return friend._id !== id && <Link state={friend._id} onClick={() => setFrinedsUser([])} to="/friendProfile" className="cursor-pointer  rounded-lg flex  px-2 items-center gap-6 border-b-2 py-2 ">
                      <img className="w-18 h-11 rounded-full" src={friend.profilePic} alt="" />
                      <p className="capitalize">{friend.name}</p>
                    </Link>
                  })
                }
              </ul>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-black bg-inherit rounded-md hover:bg-blue-300"
            >
              <img
                className="h-[50px] w-[50px] bg-inherit rounded-md"
                src={userCtx.userInfo?.user?.profilePic ? userCtx.userInfo.user.profilePic : "https://as2.ftcdn.net/jpg/03/16/12/51/1000_F_316125188_FYs3RbaUQ6gGwom3sfqSvgt2QGw3fKol.webp"}
                alt=""
              />
            </div>

            {isDropdownOpen === true && <div className='login dropDownBox  absolute top-[120%] right-0 bg-gradient-to-r border-2 shadow-xl rounded-md bg-black text-white'>
              <ul >
                {login === false && <li className=' border-b-2 bg-white text-black border-b-black  py-2 px-5 '><button className='' onClick={() => navigate('/login')}>Login</button></li>}

                {login === true && <li onClick={() => userCtx.logout()} className='bg-white text-black border-b-2 border-b-black  py-2 px-5 '><button className=''>Logout</button></li>}

                {login === false && <li className=' border-b-2 bg-white text-black border-b-black  py-2 px-5 '><button onClick={() => navigate('/register')} className=''>Signup</button></li>}
              </ul>
            </div>}
          </div>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
