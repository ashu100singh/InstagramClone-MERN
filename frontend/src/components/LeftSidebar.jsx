import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Heart,
    Home,
    LogOut,
    MessageCircle,
    PlusSquare,
    Search,
    TrendingUp,
} from "lucide-react";
import { setAuthUser } from "@/redux/authSlice.js";
import CreatePost from "./CreatePost.jsx";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(store=>store.auth);
    const [open, setOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/api/v1/user/logout",
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        } else if(textType === "Create") {
            setOpen(true)
        } else if(textType === "Profile") {
            navigate(`/profile/${user?._id}`)
        } else if(textType === 'Home') {
            navigate('/')
        }
    };

    const sidebarItems = [
        {
            icon: <Home />,
            text: "Home",
        },
        {
            icon: <Search />,
            text: "Search",
        },
        {
            icon: <TrendingUp />,
            text: "Explore",
        },
        {
            icon: <MessageCircle />,
            text: "Messages",
        },
        {
            icon: <Heart />,
            text: "Notifications",
        },
        {
            icon: <PlusSquare />,
            text: "Create",
        },
        {
            icon: (
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile",
        },
        {
            icon: <LogOut />,
            text: "Logout",
        },
    ];

    return (
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-400 w-[16%] h-screen">
            <div className="flex flex-col">
                <h1 className="my-8 pl-3 font-bold text-xl">Instagram</h1>
                <div>
                    {sidebarItems.map((item, index) => {
                        return (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3"
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
