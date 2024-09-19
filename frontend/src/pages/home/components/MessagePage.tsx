import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import backgroundImage from "../../../assets/images/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import Avatar from "../../../shared/components/Avatar";
import { IUser } from "../../../shared/utility/models/user.model";
import { useGetUserDetailsQuery } from "../utility/services/user.service";
import uploadFile from "../../../shared/utility/helpers/uploadFile";
import Loading from "../../../shared/components/Loading";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const [userData, setUserData] = useState<IUser>({
    name: "",
    email: "",
    profilePicture: "",
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage: any = useRef(null);
  const userId = localStorage.getItem("userId");



  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const { data: user } = useGetUserDetailsQuery({
    userId: userId,
  });

  const socketConnection = useSelector(
    (state: any) => state?.user?.socketConnection
  );

  // open the upload image and video
  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  // upload image to cloudinary and preview it
  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadImage = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev: any) => {
      return {
        ...prev,
        imageUrl: uploadImage.url,
      };
    });
  };

  // for clearing upload image
  const handleClearUploadImage = () => {
    setMessage((prev: any) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  // upload video to cloudinary and preview it
  const handleUploadVideo = async (e: any) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.url,
      };
    });
  };

  // for clearing upload video
  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  
  
  // for socket connection
  useEffect(() => {
    if(user){
      if (socketConnection) {
        console.log(user);
        socketConnection.emit("message-page", params.userId);
        socketConnection.emit("seen", params.userId)
        socketConnection?.on("message-user", (data: IUser) => {
          console.log("userDetails", data);
          setUserData(data);
        });
        socketConnection?.on("message", (data: any) => {
          console.log("message", data);
          setAllMessage(data);
        });
        
        
      }
    }
  }, [socketConnection,params.userId, user]);



  const handleOnChange = (e: any) => {

    setMessage((prev) => {
      return {
        ...prev,
        text: e.target.value,
      };
    });
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user.data._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?.data._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <>
    {userData && <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={userData?.profilePicture}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            {/* <p className='-my-2 text-sm'>
                {
                  dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                }
               </p> */}
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg: any, index: any) => {
            return (
              <div
                key={index}
                className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  // Check if the message was sent by the logged-in user
                  user?.data?._id === msg?.msgByUserId
                    ? "ml-auto bg-teal-100" // Sent by the logged-in user
                    : "bg-white" // Received message
                }`}
              >
                <div className="w-full relative">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("LT")}
                </p>
              </div>
            );
          })}
        </div>

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/**send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>}
    </>
  );
};

export default MessagePage;
