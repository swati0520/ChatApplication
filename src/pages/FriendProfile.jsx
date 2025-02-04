import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { Link, useLocation } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { LiaComments } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

function friendProfile() {
let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"

  let ctx = useContext(UserContext);

  let userId = ctx.userInfo.userId;
  let user = ctx.userInfo.user;
 
  let location = useLocation();


  const [friend, setfriend] = useState("");
  const [friendPost, setfriendPost] = useState([]);


  async function getFriendUser() {
    let res = await axios.get(url+`/users/getuser/${location.state}`);
    let data = res.data;
    if (data.success) {

      setfriend(data.friend);
    }
  }

  async function getFriendPost() {
    let res = await axios.get(
      url+`/post/getFriendPost/${location.state}`
    );
    let data = res.data;
    if (data.success) {
     
      setfriendPost(data.posts);
    }
  }

  useEffect(() => {
    getFriendUser();
   
  }, [location.state]);

  useEffect(() => {
    getFriendPost();
  }, [location.state]);

  const handelFollow = async () => {
    let res = await axios.post(
      url+`/users/followuser/${friend._id}`,
      {},
      {
        headers: {
          'Authorization': ctx.userInfo.token,
        },
      }
    );

    let data = res.data;
 
    if (data.success) {
      getFriendUser();
    }
  };
  return (
    <div className="w-[85%] mx-auto">
      <div className="coverPicBox h-[20vw]  relative">
        <img className="h-full w-full" src={friend?.coverPic} alt="" />
        <div className="profilePicBox  w-40 h-40 rounded-full absolute sm:left-[43%] left-[34%]  -bottom-24 ">
          <img
            src={friend?.profilePic}
            className="sm:w-full sm:h-full rounded-full  h-28 w-28 "
            alt=""
          />
        </div>
      </div>
      <div>
        <h1 className="profileName italic text-black  capitalize sm:mt-[95px] mt-[55px] text-center font-bold text-2xl">
          {friend?.name}{" "}
        </h1>
        <h1 className="profileName italic text-black capitalize  text-center font-bold text-2xl">
          {friend?.bio}{" "}
        </h1>  
        <div className="flex italic  justify-center mt-8 gap-5">
          {friend?.followers?.includes(userId) ? 
            <button
              onClick={handelFollow}
              className="bg-purple-300  font-bold  px-4 py2 hover:bg-slate-400 text-black rounded-md "
            >
              Unfollow
            </button>
           : 
            <button
              onClick={handelFollow}
              className="bg-purple-300  font-bold px-4 py2 hover:bg-slate-400 text-black rounded-md "
            >
              follow
            </button>
          }
          <Link
            to={"/message"}
            state={friend}
            className="bg-purple-300  px-4 py-2 rounded-md gap-4 font-bold text-black"
          >
            Message
          </Link>
        </div>
        <div className="flex justify-center gap-10">
          <div className="text-white flex flex-col items-center font-bold">
            <p>Followers</p> <span>{friend?.followers?.length}</span>
          </div>
          <div className="text-white flex flex-col items-center font-bold">
            <p>Following</p> <span>{friend?.following?.length}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 mt-7 ">
        {
        friendPost.map((ele) => {
          return (
            <div className="w-[380px] py-4 px-6 relative overflow-hidden rounded-lg shadow-md border-2 dark:bg-white  ">
              <div className="mt-4 ms-6">
                <div className="flex items-center">
                  <div>
                    <img
                      className="object-cover h-10 rounded-full"
                      src={friend?.profilePic}
                    />
                    <a
                      href="#"
                      className="mx-2 font-semibold text-gray-900 dark:text-black"
                      tabIndex={0}
                      role="link"
                    >
                      {friend?.name}
                    </a>
                  </div>
                  <span className="mx-1 text-xs text-gray-600 dark:text-black font-bold">
                    {formatDistanceToNow(ele.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>

              {ele.file.includes("image")
               ? 
                <img
                  className="object-contain w-full h-64"
                  src={ele.file}
                  alt="Article"
                />
               :
                ele.file.includes("video") ? 
                <video controls src={ele.file}></video>
               : 
                ""
             }
              <div className="p-6">
                <div>
                  <a
                    href="#"
                    className="block mt-2 text-xl font-semibold text-gray-500 transition-colors  duration-300 transform dark:text-black hover:text-gray-600 hover:underline"
                    tabIndex={0}
                    role="link"
                  >
                    {ele.title}
                  </a>
                  <p className="mt-2 text-sm text-black dark:text-black hover:text-gray-600 hover:underline">
                    {ele.description}
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 items-center  ">
                {ele.like.includes(user._id) ? 
                  <FaHeart color="red" fill="red" size={24} />
                 : 
                  <CiHeart color="red" fill="red" size={30} />
                }
                <sup>{ele.like.length}</sup>

                <div className="flex">
                  <LiaComments className="cursor-pointer" size={26} />
                  <sup className="rounded-full w-5 h-5 flex justify-center items-center">
                    {ele.comments.length}
                  </sup>
                </div>
              </div>

              <div className="py-3 px-5 flex items-center gap-2 ">
                <img
                  src={user?.profilePic}
                  className="w-12 h-12 rounded-full border-black"
                  alt=""
                />
                <input
                  className="border-2 outline-2 rounded-md w-full h-8 "
                  placeholder="write your comment.."
                  type="text"
                />
                <IoSend className="h-8 w-8 cursor-pointer" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default friendProfile;
