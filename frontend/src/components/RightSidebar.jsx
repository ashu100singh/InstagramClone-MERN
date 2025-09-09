import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-80 my-10 pr-8 sticky top-20 mr-5">
      {/* User Profile Card */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm hover:underline cursor-pointer">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-500 text-xs line-clamp-2">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>

      {/* Suggested Users Section */}
      <div className="mt-6">
        <div className="flex flex-col gap-2">
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
