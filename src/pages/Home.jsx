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
  let url = import.meta.env.VITE_DEPLOYMENT=== 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"

  const [openModal, setOpenModal] = useState(false);
  let ctx = useContext(UserContext);




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
          'Authorization': token,
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
      <div className=" sm:ml-[200px] pb-14 mb-4  flex flex-col items-center gap-5 p-2 ">
        {post.map((ele, index) => {
          return (
            <div
              key={index}
              className="max-w-md max-h-full mt-4 sm:mt-4  overflow-hidden sm:m-auto  bg-gray-600 rounded-lg shadow-md  dark:bg-gray-800"
            >
              <div className="mt-4 ms-6">
                <div className=" ">
                  <div className="flex items-center">
                    <img
                      className="object-cover h-12 rounded-full w-12"
                      src={ele?.userId?.profilePic}
                    />
                    <a
                      href="#"
                      className="mx-2 capitalize  font-bold text-white"
                      tabIndex={0}
                      role="link"
                    >
                      {ele?.userId?.name}
                    </a>
                  </div>
                  <span className="mx-0 text-xs font-bold ml-36 mb-2 text-white">
                  {formatDistanceToNow(new Date(ele.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {ele.file.includes("image") ? (
                <img
                  className="object-contain mt-2 w-full h-32"
                  src={ele.file}
                  alt="Article"
                />
              ) : ele.file.includes("video") ? (
                <video className="mt-6 w-[300px]  h-32 m-auto" controls src={ele.file}></video>
              ) : (
                ""
              )}
              <div className="p-6">
                <div>
                  <a
                    href="#"
                    className="block mt-2 text-xl font-semibold  transition-colors  duration-300 transform  text-white  hover:underline"
                    tabIndex={0}
                    role="link"
                  >
                    {ele.title}
                  </a>
                  <p className="mt-2 text-sm  text-white  hover:underline">
                    {ele.description}
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 items-center  p-4">
                {ele.like.includes(user?._id) ? (
                  <FaHeart
                    onClick={() => handelLikes(ele._id)}
                    color="red"
                    fill="red"
                    size={24}
                  />
                ) : (
                  <CiHeart
                    onClick={() => handelLikes(ele._id)}
                    color="red"
                    fill="red"
                    size={30}
                  />
                )}
                <sup className=" text-white">{ele.like.length}</sup>

                <div className="flex">
                  <LiaComments
                    onClick={() => handelComments(ele)}
                    className="cursor-pointer  text-white"
                    size={26}
                  />
                  <sup className="rounded-full w-5 h-5 flex justify-center items-center  text-white">
                    {ele.comments.length}
                  </sup>
                </div>
              </div>

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
                  className="h-8 w-8 cursor-pointer  text-white"
                  onClick={() => handelCommentsSubmit(ele)}
                />
              </div>
            </div>
          );
        })}
      </div>


      <Modal
        className="w-full sm:w-[448px] sm:ml-[40.3%] h-[300px] rounded-lg  mx-auto  top-[100px] mt-80"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>
          <p className=" p-2  text-black">Comments...</p>
        </Modal.Header>
        <Modal.Body>
          {selectedPost?.comments?.length > 0 ? (
            <div className="space-y-6 ">
              {selectedPost?.comments?.map((item) => {
                return (
                  <div className="border relative rounded-md p-3 ml-3 my-3">
                    <div className="flex gap-3 items-center ">
                      <img
                        src={item?.user?.profilePic}
                        className="object-cover w-8 h-8 rounded-full 
                        border-2 shadow-emerald-4002"
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
