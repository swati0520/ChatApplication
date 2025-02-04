import React, { useContext, useState } from "react";
import UserContext from "../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const Setting = () => {
  let ctx = useContext(UserContext);
  let url = import.meta.env.Vite_DEPLOYMENT === 'production'?import.meta.env.VITE_ENDPOINT : "http://localhost:8092"

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
  const handelUpdateSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.put(
      url+`/users/update/${userID}`,
      userInfo,
      {
        headers: {
          'Authorization': ctx.userInfo.token,
        },
      }
    );
    let data = res.data;

    if (data.success) {
      getUserData();
      toast.success(data.msg, { position: "top-center" });
    } else {
      toast.error(data.msg, { position: "top-center" });
    }
  };

  const handelInfoUpdater = (e) => {
    setuserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="m-auto">
      <form
        action=""
        className="flex flex-col w-1/2 m-auto  gap-3"
      >
        <label htmlFor="">Name:</label>
        <input
          type="text"
          onChange={handelInfoUpdater}
          name="name"
          value={userInfo?.name}
          className="p-1 outline-none text-gray-800 border-2 border-black rounded-md"
        />
        <label htmlFor="">Bio:</label>
        <textarea
          name="bio"
          onChange={handelInfoUpdater}
          id=""
          value={userInfo.bio}
          className=" outline-none text-gray-800 border-2 border-black rounded-md "
        ></textarea>
        <button
          onClick={handelUpdateSubmit}
          className="bg-blue-950 text-white p-1 rounded-md "
        >
          Update
        </button>
      
      </form>
    </div>
  );
};

export default Setting;
