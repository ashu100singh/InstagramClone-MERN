import React, { useEffect } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "./redux/socketSlice.js";
import { setOnlineUsers } from "./redux/chatSlice.js";
import { setLikeNotification } from "./redux/rtnSlice.js";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoutes><MainLayout/></ProtectedRoutes> ,
        children: [
            {
                path: "/",
                element: <ProtectedRoutes><Home/></ProtectedRoutes>,
            },
            {
                path: "/profile/:id",
                element: <ProtectedRoutes><Profile/></ProtectedRoutes>,
            },
            {
                path: "/profile/edit",
                element: <ProtectedRoutes><EditProfile/></ProtectedRoutes>,
            },
            {
                path: "/chat",
                element: <ProtectedRoutes><ChatPage/></ProtectedRoutes>,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    { 
        path: "*", 
        element: <NotFound /> 
    },
]);

const App = () => {
    const { user } = useSelector((store) => store.auth)
    const { socket } = useSelector((store) => store.socketio)
    const dispatch = useDispatch()

    useEffect(() => {
    if (user) {
        const socketio = io("http://localhost:8000", {
            query: { userId: user?._id },
            transports: ["websocket"]
        });

        // ✅ Save the socket in Redux
        dispatch(setSocket(socketio));

        // ✅ Get online users list
        socketio.on("getOnlineUsers", (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
        });

        // ✅ Get new notifications in real-time
        socketio.on("notification", (notification) => {
            dispatch(setLikeNotification(notification));
        });

        // ✅ Cleanup old socket connections
        return () => {
            socketio.disconnect();
            dispatch(setSocket(null));
        };
    } else if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
    }
}, [user, dispatch]);


    return (
        <>
            <RouterProvider router={browserRouter} />
        </>
    );
};

export default App;
