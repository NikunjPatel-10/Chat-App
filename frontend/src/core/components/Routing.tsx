import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/home/Home";
import MessagePage from "../../pages/home/components/MessagePage";
import Registration from "../../pages/registration/Registration";
import Login from "../../pages/login/Login";

const router = createBrowserRouter([
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
