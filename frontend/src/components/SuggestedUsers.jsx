import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col gap-3 mt-2">
      {suggestedUsers.map((user) => (
        <div
          key={user?._id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-10 h-10">
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
          <span className="font-semibold text-xs cursor-pointer text-[#3BADF8] hover:text-[#157cc1]">
            Follow
          </span>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
