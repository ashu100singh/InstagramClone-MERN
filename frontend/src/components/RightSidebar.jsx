import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
    const { user } = useSelector((store) => store.auth);

    return (
        <div className="w-fit my-10 pr-32">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${user?._id}`}>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="Profile" />
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
			<SuggestedUsers/>
        </div>
    );
};

export default RightSidebar;
