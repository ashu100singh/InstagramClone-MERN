import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home as HomeIcon,
  MessageCircle as MessageIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  PlusSquare as PlusIcon,
  LogOut as LogoutIcon,
} from "lucide-react";

// Use FontAwesome hearts for clear outline vs filled heart
import { FaRegHeart, FaHeart } from "react-icons/fa";

import { setAuthUser } from "@/redux/authSlice.js";
import CreatePost from "./CreatePost.jsx";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx";
import { Button } from "./ui/button.jsx";
import { clearNotifications } from "@/redux/rtnSlice.js";

const ICON_SIZE = 26; // consistent icon size for all sidebar icons

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);

  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://instagramclone-mern.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login", { replace: true });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  const sidebarHandler = (text) => {
    if (text === "Logout") logoutHandler();
    else if (text === "Create") setOpen(true);
    else if (text === "Profile") navigate(`/profile/${user?._id}`);
    else if (text === "Home") navigate("/");
    else if (text === "Messages") navigate("/chat");
  };

  const sidebarItems = [
    { icon: <HomeIcon size={ICON_SIZE} />, text: "Home" },
    { icon: <SearchIcon size={ICON_SIZE} />, text: "Search" },
    { icon: <TrendingIcon size={ICON_SIZE} />, text: "Explore" },
    { icon: <MessageIcon size={ICON_SIZE} />, text: "Messages" },
    // Notifications handled specially in render
    { icon: <PlusIcon size={ICON_SIZE} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-7 h-7 border-2 border-gray-200">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogoutIcon size={ICON_SIZE} />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 px-4 border-r border-gray-200 w-[16%] h-screen bg-white shadow-sm z-10">
      <div className="flex flex-col">
        <h1 className="my-6 pl-3 text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text tracking-tight">
          Instagram
        </h1>

        <div className="flex flex-col mt-4">
          {/* Render normal items up to Messages */}
          {sidebarItems.slice(0, 4).map((item, idx) => (
            <button
              key={idx}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-1 w-full text-left transition-all duration-300 hover:bg-gray-100"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.text}</span>
            </button>
          ))}

          {/* ---- Notifications (special handling) ---- */}
          <div className="my-1">
            <Popover>
              <PopoverTrigger asChild>
                {/* Button shows icon + label; badge absolutely positioned relative to this button */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()} // prevent outer click handlers
                  className="flex items-center gap-3 cursor-pointer rounded-lg p-3 w-full text-left transition-all duration-300 hover:bg-gray-100"
                >
                  {/* choose filled or outline heart based on notifications */}
                  <span className="flex items-center relative">
                    {likeNotification?.length > 0 ? (
                      <FaHeart size={ICON_SIZE} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={ICON_SIZE} className="text-gray-700" />
                    )}

                    {likeNotification?.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white border border-red-500 text-red-500 text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                          {likeNotification.length}
                      </span>

                  )}
                  </span>

                  <span className="text-sm font-medium">Notifications</span>

                  
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-72 bg-white shadow-lg rounded-lg p-3 max-h-72 overflow-y-auto"
                align="right"
                sideOffset={8}
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold mb-2">Notifications</h3>

                  {Array.isArray(likeNotification) && likeNotification.length > 0 ? (
                    likeNotification.map((notification, idx) => (
                      <div
                        key={`${notification.userId || "u"}-${notification.postId || idx}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.userDetails?.profilePicture} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">
                          <span className="font-semibold">
                            {notification.userDetails?.username || "Someone"}
                          </span>{" "}
                          liked your post ❤️
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500">No new notifications</p>
                  )}

                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => dispatch(clearNotifications())}
                    >
                      Clear notifications
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Render remaining sidebar items (Create, Profile, Logout) */}
          {sidebarItems.slice(4).map((item, idx) => {
            const keyIdx = idx + 4;
            return (
              <button
                key={keyIdx}
                onClick={() => sidebarHandler(item.text)}
                className="flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-1 w-full text-left transition-all duration-300 hover:bg-gray-100"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
