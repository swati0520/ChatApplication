import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Descriptions, Modal } from "antd";
import UserContext from "../context/UserContext";
import { IoCameraOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

function Profile() {
    let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let ctx = useContext(UserContext);
  
  let userID = ctx.userInfo.userId;

  const [userInfo, setuserInfo] = useState("");


  async function getUserData() {
    let res = await axios.get(url+"/users/getUser", {
      headers: {
        " Authorization": ctx.userInfo.token,
      },
    });
    let data = res.data;
    setuserInfo(data.data);
  }
  const [allPosts, setallPosts] = useState([]);
 

  async function yourPosts() {
    let res = await axios.get(url+"/post/getYourPost", {
      headers: {
        "Authorization": ctx.userInfo.token,
      },
    });
    let data = res.data;
   
    setallPosts(data.post);
  }
  useEffect(() => {
    yourPosts();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  // profile update
  const handelProfileChanger = async (e) => {
    let file = e.target.files[0];
  
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Media_App");

    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/dp8ihosht/upload",
      formData
    );
    let data = res.data;
    

    if (data) {
      let res1 = await axios.put(
        url+`/users/update/${userID}`,
        { profilePic: data.secure_url },
        {
          headers: {
            "Authorization": ctx.userInfo.token,
          },
        }
      );
      let data1 = res1.data;

      if (data1.success) {
        getUserData();
        toast.success(data1.msg, { position: "top-center" });
      } else {
        toast.error(data1.msg, { position: "top-center" });
      }
    } else {
      toast.error({ msg: "unable to upload image", position: "top-center" });
    }
  };
  // end part
  const handelDelete = async (ele) => {
   
    let res = await axios.delete(
      url+`/post/delete/${ele._id}`
    );
    let data = res.data;

    if (data.success === true) {
      yourPosts();
    }
  };
  const [update, setupdate] = useState({});
  

  const updatedescription = async (e) => {
 

    const { name, value } = e.target; // Destructure name and value from event target

    // Create an updated object with dynamic property based on the input name
    const obj = {
      ...update, // Preserve previous state
      [name]: value, // Dynamically set the property
    };
   ;
    setupdate(obj);
  };
  const [postId, setpostId] = useState();
  const updatePost = (ele) => {

    setpostId(ele._id);
  };
  const handelSubmit = async () => {
   

    let res = await axios.put(
      url+`/post/update/${postId}`,
      update
    );
    let data = res.data;
if(data.success === true){
  yourPosts();
  setIsModalOpen(false);
  setupdate({title:'',description:''})
}

   
  };

  const handelcoverChanger= async(e)=>{
  
    
    let file = e.target.files[0];
  

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Media_App");

    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/dp8ihosht/upload",
      formData
    );
    let data = res.data;
   

    if (data) {
      let res1 = await axios.put(
        url+`/users/update/${userID}`,
        { coverPic: data.secure_url },
        {
          headers: {
            "Authorization": ctx.userInfo.token,
          },
        }
      );
      let data1 = res1.data;

      if (data1.success) {
        getUserData();
        toast.success(data1.msg, { position: "top-center" });
      } else {
        toast.error(data1.msg, { position: "top-center" });
      }
    } else {
      toast.error({ msg: "unable to upload image", position: "top-center" });
    }
  }

  return (
    <div className="w-[85%] mx-auto ">
      <div className="coverPicBox h-[20vw] mr-1 relative">
        <img className="h-full w-full mr-8" src={userInfo?.coverPic} alt="" />

        <input
            onChange={handelcoverChanger} 
            type="file"
            id="coverPic"
            hidden
          />
          <label
            htmlFor="coverPic"
            className="absolute right-0 left-43 sm:top-28 top-10 cursor-pointer "
          >
            <IoCameraOutline className="bg-white p-2 rounded-full text-black"  size={45} />
          </label>

        <div className="profilePicBox  sm:w-40 sm:h-40 w-36 h-36 rounded-full absolute sm:left-[43%] left-[30%] -bottom-24 ">
          <img
            src={userInfo?.profilePic}
            className="w-full h-full rounded-full"
            alt=""
          />
          <input
            onChange={handelProfileChanger} 
            type="file"
            id="profilePic"
            hidden
          />
          <label
            htmlFor="profilePic"
            className="absolute right-0  left-26 bg-white p-2 rounded-full top-20 cursor-pointer "
          >
            <IoCameraOutline color="black" size={30} />
          </label>
        </div>
      </div>

      <div className="flex flex-col border-b border-blue-950 mb-2  items-center ">
        <h1 className="profileName  capitalize mt-[95px] text-center font-bold text-2xl">
          {userInfo?.name}{" "}
        </h1>
        <h1 className="profileName  capitalize  text-center  text-2xl">
          {userInfo?.email}{" "}
        </h1>

        <h1 className="profileName  capitalize  text-center  text-2xl">
          {userInfo?.bio}{" "}
        </h1>

        <div className="flex gap-9">
          <div className="flex flex-col items-center ">
            <h3 className="font-bold">Post</h3>
            <p>{allPosts.length}</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold">Followers</h3>
            <p>{userInfo?.followers?.length}</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold">Following</h3>
            <p>{userInfo?.following?.length}</p>
          </div>
        </div>
      </div>
      <div  className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-2 ">
        {allPosts?.map((ele, index) => {
          return (
            <div key={index} className="flex flex-wrap  pb-2  ">
              <div className="w-60 flex justify-center items-start flex-col m-auto  overflow-hidden  rounded-lg shadow-lg h-[400px] ">
                <div className="px-4 py-2 flex justify-between bg-slate-500 w-full">
                  <h1 className="text-xl font-bold h-max uppercase dark:text-black ">
                    {ele.title}
                  </h1>
                  <div className="flex gap-2">
                    <p onClick={() => handelDelete(ele)}>
                      <MdDelete />
                    </p>
                    <p onClick={() => updatePost(ele)}>
                      <span onClick={showModal}>
                        <BsThreeDotsVertical />
                      </span>
                    </p>
                  </div>
                </div>

                {ele.file.includes("image") ? (
                  <img
                    className="object-contain w-[300px] h-[400px] p-2 "
                    src={ele.file}
                    alt="Article"
                  />
                ) : ele.file.includes("video") ? (
                  <video  className="object-contain w-[300px] h-[300px] p-2 " controls src={ele.file}></video>
                ) : (
                  ""
                )}
                <p className="mt-1 text-sm  text-black font-bold italic p-4 ">
                  {ele.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col gap-2 ">
          <label htmlFor="">Title</label>
          <input
            name="title"
            value={update.title}
            onChange={updatedescription}
            className="border-2 border-blue-950 py-2 px-4 outline-none"
            type="text"
          />

          <label htmlFor="">description</label>
          <input
            value={update.description}
            onChange={updatedescription}
            className="border-2 border-blue-950 py-2 px-4 outline-none"
            name="description"
            id=""
          ></input>

          <button
            onClick={handelSubmit}
            className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full cursor-pointer"
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
