import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
// import Avatar from './Avatar'
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import SearchUser from "../../shared/components/SearchUser";
import { useGetUserDetailsQuery } from "../../pages/home/utility/services/user.service";
import Avatar from "../../shared/components/Avatar";
import { useSelector } from "react-redux";
import moment from "moment";



const Sidebar = () => {
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const socketConnection = useSelector(
    (state: any) => state?.user?.socketConnection
  );

  const { data: userData } = useGetUserDetailsQuery({
    userId: userId,
  });

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", userId);
      socketConnection.on("conversation", (data: any) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser: any) => {
          // if user is talk to himslef
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser?.receiver?._id !== userId) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection]);

  const userLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            to={""}
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button className="mx-auto">
            <Avatar
              width={40}
              height={40}
              name={userData?.data?.name}
              imageUrl={userData?.data?.profilePicture}
              userId={userData?.data?._id}
            />
          </button>
          <button
            onClick={userLogout}
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser && allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv: any,) => {
            console.log(conv);
            
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex justify-between gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div className="flex ">
                  <Avatar
                    imageUrl={conv?.userDetails?.profilePicture}
                    name={conv?.receiver?.name}
                    width={40}
                    height={40}
                  />
                  <div className="ps-2">
                    <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                      {conv?.userDetails?.name}
                    </h3>
                    <div className="text-slate-500 text-xs flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        {conv?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1">
                            <span>
                              <FaImage />
                            </span>
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.videoUrl && (
                          <div className="flex items-center gap-1">
                            <span>
                              <FaVideo />
                            </span>
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )}
                      </div>
                      <p className="text-ellipsis line-clamp-1">
                        {conv?.lastMsg?.text}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                <p className="text-xs  w-[50px] ">
                  {moment(conv?.lastMsg?.createdAt).format("LT")}
                </p>
                  {Boolean(conv?.unseenMsg) && (
                    <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                      {conv?.unseenMsg}
                    </p>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
      {/**search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
