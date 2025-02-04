import React, { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import UserContext from "../context/UserContext";
import { LiaComments } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Modal, Button } from "flowbite-react";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";

const Home = () => {
  let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"

  const [openModal, setOpenModal] = useState(false);
  let ctx = useContext(UserContext);
  let commentsRef = useRef();



  let token = ctx.userInfo.token;
  let user = ctx.userInfo.user;
 

  const [post, setpost] = useState([]);


  async function getAllPost() {
    let res = await axios.get(url+"/post/getAllPost");
    let data = res.data;
 
    setpost(data.post);
  }

  useEffect(() => {
    getAllPost();
  }, []);

  const [selectedPost, setselectedPost] = useState();
  const handelComments = (ele) => {
   
    setselectedPost(ele);
    setOpenModal(true);
  };

  const [newComment, setnewComment] = useState([]);

  const handelCommentsChnager = (e) => {
  
    setnewComment(e.target.value);
  };

  const handelCommentsSubmit = async (ele) => {
   
    let obj = {
      text: newComment,
    };
 

    let res = await axios.post(
      url+`/post/comment/${ele._id}`,
      obj,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    let data = res.data;
 
    if (data.success) {
      toast.success(data.msg, { position: "bottom-right" });
      setnewComment("");
      getAllPost();
    }
  };
  const handelRemoveComments = async (comment, post) => {
    let commentId = comment._id;
    let postId = post._id;
;

    let res = await axios.delete(
      url+`/post/commentDelete/${commentId}/${postId}`
    );
    let data = res.data;
   

    if (data.success) {
      getAllPost();
      let filterdArr = selectedPost.comments.filter(
        (ele) => ele._id !== comment._id
      );
      let copyObj = { ...selectedPost };
      copyObj.comments = filterdArr;
      setselectedPost(copyObj);
      toast.success(data.msg, { position: "top-center" });
    }
  };

  const handelLikes = async (postId) => {
    let res = await axios.put(
      url+`/post/likePost/${postId}`,
      {},
      {
        headers: {
          "  Authorization": token,
        },
      }
    );
    let data = res.data;
   
    if (data.success) {
      getAllPost();
      toast.success(data.msg, { position: "top-center" });
    }
  };

  return (
    <div>
      <Sidebar getAllPost={getAllPost} />
      <div className=" sm:ml-[200px]  flex flex-col items-center gap-5 ">
        {post.map((ele, index) => {
          return (
            <div className="mb-6 ">
              {ele.file.includes("video") && (
                <div
                  key={index}
                  className="w-[380px] h-max  py-6 px-6 overflow-hidden rounded-lg shadow-md border-2 
                   relative "
                >
                  <div className="mt-4 ms-6">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <img
                          className="object-cover h-12 w-12 rounded-full "
                          src={ele?.userId?.profilePic}
                        />
                        <a
                          href="#"
                          className="mx-2 font-semibold text-black"
                          tabIndex={0}
                          role="link"
                        >
                          {ele?.userId?.name}
                        </a>
                      </div>
                      <span className="mx-1 text-xs  text-black">
                        {formatDistanceToNow(ele.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {ele.file.includes("video") ? (
                    <video className="mt-10" controls src={ele.file}></video>
                  ) : (
                    ""
                  )}
                  <div className="p-6">
                    {ele.file.includes("video") && (
                      <div>
                        <p className="mt-2 text-sm  text-black hover:underline">
                          {ele.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex  gap-2 items-center  ">
                    {ele.file.includes("video") && (
                      <div className="flex">
                         
                        {ele.like.includes(user._id) ? 
                          <span className="flex items-center"> 
                            
                        
                          <FaHeart
                            onClick={() => handelLikes(ele._id)}
                            color="red"
                            fill="red"
                            size={24}
                          />
                           <sup className="text-black items-center">{ele.like.length}</sup>
                          </span>
                         :
                     
                          <span className="flex items-center">
                             
                            <CiHeart
                            onClick={() => handelLikes(ele._id)}
                            color="red"
                            fill="red"
                            size={30}
                          />
                           <sup className="text-black items-center">{ele.like.length}</sup>
                          </span>
                         
                        }
                       
                      </div>
                    )}
                     
                    {ele.file.includes("video") && (
                      <div className="flex">
                        <LiaComments
                          onClick={() => handelComments(ele)}
                          className="cursor-pointer text-black"
                          size={26}
                        />
                        <sup className="rounded-full w-5 h-5 flex justify-center items-center text-black">
                          {ele.comments.length}
                        </sup>
                      </div>
                    )}
                  </div>

                  {ele.file.includes("video") && (
                    <div className="py-3 px-5 flex items-center gap-2 ">
                      <img
                        src={user?.profilePic}
                        className="w-10 h-10 rounded-full border-black"
                        alt=""
                      />
                      <input
                        value={newComment}
                        onChange={handelCommentsChnager}
                        className="border-2 outline-2 rounded-md w-full h-8 "
                        placeholder="write your comment.."
                        type="text"
                      />
                      <IoSend
                        className="h-8 w-8 cursor-pointer text-black"
                        onClick={() => handelCommentsSubmit(ele)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        className="sm:w-[30%]  sm:mx-[580px] top-[100px] right-0 sm:left-0   m-auto mt-80  "
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>
          <p className=" p-2 text-white ">Comments...</p>
        </Modal.Header>
        <Modal.Body>
          {selectedPost?.comments?.length > 0 ? (
            <div className="space-y-6 ">
              {selectedPost?.comments?.map((item) => {
                return (
                  <div className="border relative rounded-md p-3 ml-3 my-3">
                   
                      <div className="flex gap-3 items-center">
                        <img
                          src={item?.user?.profilePic}
                          className="object-cover w-8 h-8 rounded-full 
                        border-2 border-emerald-400  shadow-emerald-4002"
                        />
                        <h3 className="font-bold">{item.user.name}</h3>
                      </div>
                   
                    <p className=" text-gray-600 mt-2">{item.text}</p>

                    {user._id === item.user._id && (
                      <RiDeleteBin6Line
                        onClick={() => handelRemoveComments(item, selectedPost)}
                        className="absolute top-2 right-5 text-lg cursor-pointer"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <h1 className="capitalize text-center text-xl">
              No comments Available
            </h1>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
