import React, { useContext, useState } from "react";
import { Button, Descriptions, Modal } from "antd";
import axios from "axios";
import UserContext from "../context/UserContext";
import { toast } from "react-toastify";
import { MdOutlineRoundaboutLeft } from "react-icons/md";
import { BsCameraReels } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md"
import { IoSearchOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";

const Sidebar = (props) => {

 let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"
   
  let navgate = useNavigate();

  let ctx = useContext(UserContext);

  let userId = ctx.userInfo.userId;


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

  const [isModalOpens, setIsModalOpens] = useState(false);

  const showModals = () => {
    setIsModalOpens(true);
  };
  const handleOks = () => {
    setIsModalOpens(false);
  };
  const handleCancels = () => {
    setIsModalOpens(false);
  };

  const [details, setdetails] = useState({
    title: "",
    description: "",
    file: "",
  });


  const handelInputChnager = (e) => {
    setdetails({ ...details, [e.target.name]: e.target.value });
  };

  const [loading, setloading] = useState(false);

  const handelFileChnager = async (e) => {
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
  };

  const handelSubmit = async () => {
    let res = await axios.post(url+"/post/create", details, {
      headers: {
        "Authorization": ctx.userInfo.token,
      },
    });

    let data = res.data;
  
    if (data.success) {
      toast.success(data.msg, { position: "bottom-right" });
      setIsModalOpen(false);
      setdetails({ title: "", description: "", file: "" });
      props.getAllPost();
    } else {
      toast.error(data.msg, { position: "bottom-right" });
    }
  };

  const [friendsUser, setFrinedsUser] = useState([]);


  const handelInputChnagers = async (e) => {
    let res = await axios.get(url+`/users/username?q=${e.target.value}`)
    let data = res.data
   
    setFrinedsUser(data);

  }

  return (
    <div
      id="Sidebar"
      className="sm:bg-gray-800 sm:border-r-2 fixed z-50 sm:border-gray-700  text-white  sm:pb-4 left-0 top-[68px]"
    >
      <div className="sm:z-40 -z-50 lg:w-[240px] h-full w-[100px]">
        <div className="sm:block hidden ">
          <ul className="flex flex-col gap-8 ">
            <li
              onClick={showModal}
              className="  flex  gap-4 rounded-lg text-center p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create  transition delay-150 duration-300 ease-in-out hover:-translate-y-1   "
            >
              <MdOutlineCreateNewFolder />
              Create
            </li>

            <Link
              to="/profile"
              onClick={() => navgate("/profile")}
              className=" hover:bg-gray-200  flex  gap-4 rounded-lg text-center p-2 border-b-2  border-white cursor-pointer  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
            >
              <FaRegUser />
              Profile
            </Link>

            <Link onClick={showModals}
              to="#"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer  hover:bg-gray-200 create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 "
            >
              <IoSearchOutline />
              Search
            </Link>

            <Link
              to="/About"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
            >
              <MdOutlineRoundaboutLeft />
              About
            </Link>


            <Link
              to="/reels"
              className="rounded-lg   flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200 create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 "
            >
              <BsCameraReels />
              Reel
            </Link>

            <Link to='/help' className="rounded-lg   flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 ">
              <IoMdHelpCircleOutline size={20} />
              Help
            </Link>

            <Link
              to="/setting"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 create  "
            >
              <CiSettings size={20} /> Setting
            </Link>

            <Link to='/more' className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 ">
              {" "}
              <IoIosMore />
              More{" "}
            </Link>
          </ul>
        </div>

        <div className="sm:hidden block z-50">
          <ul className="flex fixed bg-white bottom-0 py-3   w-full gap-2 justify-evenly mt-4 p-[3px]">
            <li
              onClick={showModal}
              className="  flex  gap-4 rounded-lg text-center p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create  transition delay-150 duration-300 ease-in-out hover:-translate-y-1   "
            >
              <MdOutlineCreateNewFolder size={30} color="black" />

            </li>

            <Link
              to="/profile"
              onClick={() => navgate("/profile")}
              className=" hover:bg-gray-200  flex  gap-4 rounded-lg text-center p-2 border-b-2  border-white cursor-pointer  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
            >
              <FaRegUser size={30} color="black" />

            </Link>

            <Link onClick={showModals}
              to="#"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer  hover:bg-gray-200 create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 "
            >
              <IoSearchOutline size={30} color="black" />

            </Link>

            <Link
              to="/About"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
            >
              <MdOutlineRoundaboutLeft size={30} color="black" />

            </Link>


            <Link
              to="/reels"
              className="rounded-lg   flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200 create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 "
            >
              <BsCameraReels size={30} color="black" />

            </Link>

            <Link
              to="/setting"
              className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-white cursor-pointer hover:bg-gray-200  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 create  "
            >
              <CiSettings size={30} color="black" />{" "}
            </Link>

            <Link to="/more" className="rounded-lg  flex  gap-4 items-center   p-2 border-b-2  border-black cursor-pointer hover:bg-gray-200  create transition delay-150 duration-300 ease-in-out hover:-translate-y-1 ">
              {" "}
              <IoIosMore size={30} color="black" />
              {" "}
            </Link>
          </ul>
        </div>
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
            value={details.title}
            onChange={handelInputChnager}
            className="border-2 border-blue-950 py-2 px-4 outline-none"
            type="text"
          />

          <label htmlFor="">description</label>
          <textarea
            value={details.description}
            onChange={handelInputChnager}
            className="border-2 border-blue-950 py-2 px-4 outline-none"
            name="description"
            id=""
          ></textarea>

          <label
            htmlFor="file"
            className="bg-blue-950 text-white px-4 py-2 rounded-md  w-max cursor-pointer"
          >
            Image\Video
          </label>
          <input id="file" onChange={handelFileChnager} type="file" hidden />

          <div>
            {loading === true ? (
              "Loading..."
            ) : (
              <div>
                {details?.file && (
                  <div>
                    {details.file.includes("image") ? (
                      <img
                        className="w-1/2 mx-auto"
                        src={details.file}
                        alt=""
                      />
                    ) : (
                      <video
                        className="w-1/2 mx-auto"
                        controls
                        src={details.file}
                      ></video>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handelSubmit}
            className="bg-blue-950 text-white px-4 py-2 rounded-md  w-full cursor-pointer"
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal
        title="Friends"
        open={isModalOpens}
        onOk={handleOks}
        onCancel={handleCancels}
      >
        <div className="flex flex-col gap-2 ">
          <label htmlFor="">Search here...</label>
          <input
            name=""
            onChange={handelInputChnagers}
            className="border-2 border-blue-950 py-2 px-4 outline-none"
            type="text"
          />

          {friendsUser.map((ele) => {

            return ele._id != userId &&
              <Link state={ele._id} className="flex gap-6 items-center p-2 rounded-md border-2" to='/friendProfile' ><img className="w-6 h-6 rounded-xl" src={ele.profilePic} alt="" /> <p className="font-bold capitalize">{ele.name}</p></Link>
          })}
        </div>
      </Modal>
    </div>
  );
};
export default Sidebar;
