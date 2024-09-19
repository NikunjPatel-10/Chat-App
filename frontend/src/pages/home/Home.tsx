import React, { useEffect } from "react";
import Sidebar from "../../core/components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import MessagePage from "./components/MessagePage";
import { io } from "socket.io-client";
import logo from "./../../assets/images/logo.svg";
import { useDispatch } from "react-redux";
import { setSocketConnection } from "../../features/UserSlice";

const Home = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  //   /**
  //    * socket connection
  //    */
  useEffect(() => {
    const socketConnection = io("http://localhost:8080", {
      auth: {
        token: localStorage.getItem("accessToken"),
      },
    });
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar  />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div className="h-[350px] w-[350px] overflow-hidden">
          <img src={logo} className="h-auto w-full" alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
