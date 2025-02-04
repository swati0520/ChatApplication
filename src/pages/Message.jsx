import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";
import { io } from "socket.io-client";
import { message } from "antd";
import ScrollToBottom from "react-scroll-to-bottom";

const Message = () => {

  let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"

  let ENDPOINT =  import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"
  const socketRef = useRef();
  // let socket = io(Endpoint, { transports: ["websocket"] });

  let location = useLocation();


  let userName = location.state.name


  let userProfile = location.state.profilePic



  let userStore = useContext(UserContext);


  let token = userStore.userInfo.token;
  let friendId = location.state._id;


  let inputRef = useRef();


  const [allchat, setallchat] = useState([]);
  const getChat = async () => {
    let res = await axios.get(
      url+`2/message/getchat/${friendId}`,
      {
        headers: {
          'Authorization': token,
        },
      }
    );

    let data = res.data;

    setallchat(data.chat);
  };

  useEffect(() => {
    getChat();
  }, []);

  // This is new work
  useEffect(() => {
    socketRef.current = io(ENDPOINT,{transports: ["websocket"]});
    socketRef.current.emit("addUser", userStore?.userInfo.userId);
  }, []);

  const [details, setdetails] = useState({
    file: ""
  });



  const handelSend = async () => {
    socketRef.current.emit("sendMessage", {
      friendId,
      userId: userStore?.userInfo?.userId,
      message: inputRef.current.value,
    });
    2;

    let obj = {
      text: inputRef.current.value,
      file: details.file
    };
   


    let res = await axios.post(
      url+`/message/sendmessage/${friendId}`,
      obj,
      {
        headers: {
          " Authorization": token,
        },
      }
    );
    let data = res.data;

    if (data.success === true) {
      inputRef.current.value = "";
      getChat();
    }
  };
  const [newMessage, setnewMessage] = useState("");

  useEffect(() => {
    socketRef.current.on("getMessage", ({ userId, friendId, message }) => {
      setnewMessage({ userId, friendId, text: message });
    });
  }, []);
  useEffect(() => {
    if (newMessage) {
      setallchat([...allchat, newMessage]);
    }
  }, [newMessage]);




  const [loading, setloading] = useState(false);
  const handleFile = async (e) => {

    setloading(true);
    let file = e.target.files[0];
  

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Media_App");

    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/dp8ihosht/upload",
      formData
    );
    let data = res.data;
 
    if (data.secure_url) {
      setloading(false);
    }
    setdetails({ ...details, file: data.secure_url });

  }

  return (
    <div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col  h-[550px]">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span className="absolute text-green-500 right-0 bottom-0">
                <svg width={20} height={20}>
                  <circle cx={8} cy={8} r={8} fill="currentColor" />
                </svg>
              </span>
              <img
                src={userProfile}
                alt
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ScrollToBottom id="messages" key={''} className="flex h-[600px] flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" >
          {allchat.map((ele,index) => {
            return ele.userId === userStore?.userInfo?.userId ? (
              <div key={index} className="chat-message">
                <div className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    <div key={index}>
                      {
                      ele.text && <span className="mt-4 px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        {ele.text}
                      </span>
                      }
                      {
                        ele.file && <div>
                          {
                            ele.file.includes('image') ? <img className="w-32 h-36 mt-2 rounded-md" src={ele.file} alt="" />
                              : <video className="w-32 h-36 mt-2 rounded-md" controls src={ele.file}></video>
                          }
                        </div>
                      }
                    </div>
                  </div>
                  <img
                    src={userStore?.userInfo?.user?.profilePic}
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-2"
                  />
                </div>
              </div>
            ) : (
              <div className="chat-message">
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                      {ele.text && <span className="mt-4 px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                        {ele.text}
                      </span>}
                      {ele.file && <div>
                        {
                          ele.file.includes('image') ? <img className="w-32 h-36 mt-2 rounded-md" src={ele.file} alt="" />
                            : <video className="w-32 h-36 mt-2 rounded-md" controls src={ele.file}></video>
                        }
                      </div>}
                    </div>
                  </div>
                  <img
                    src={location?.state?.profilePic}
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-1"
                  />
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                   <div className="relative flex">
            <input
              type="text"
              ref={inputRef}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0  sm:flex">
              {loading === true  ? 'loading...': ''}
              <label className=' py-2 w-8 cursor-pointer text-white rounded-md transition-all transition-2s ' required htmlFor="file">
                <svg className="inline-flex items-center justify-center mr-3   text-gray-600 h-6 w-6 transition duration-500 ease-in-out  focus:outline-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>

              <input onChange={handleFile} className='border-2 border-gray-300' id='file' type="file" hidden />

              <button
                onClick={handelSend}
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
