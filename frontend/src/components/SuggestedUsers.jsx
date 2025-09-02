import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector((store) => store.auth);
    return (
        <div className="my-10">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-gray-700">Suggested for you</h1>
                <span className="text-sm font-medium cursor-pointer">
                    See All
                </span>
            </div>
            {suggestedUsers.map((user) => {
                return (
                    <div key={user?._id} className="flex items-center justify-between my-5">
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar>
                                    <AvatarImage
                                        src={user?.profilePicture}
                                        alt="Profile"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="">
                                <h1 className="font-semibold text-sm">
                                    <Link to={`/profile/${user?._id}`}>
                                        {user?.username}
                                    </Link>
                                </h1>
                                <span className="text-gray-500 text-sm">
                                    {user?.bio || "Bio here.."}
                                </span>
                            </div>
                        </div>
                        <span className="font-bold text-xs cursor-pointer text-[#3BADF8] hover:text-[#157cc1]">Follow</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SuggestedUsers;
