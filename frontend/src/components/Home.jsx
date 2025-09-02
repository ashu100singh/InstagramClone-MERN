import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPOst from "@/hooks/useGetAllPost.jsx";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers.jsx";

const Home = () => {
    useGetAllPOst()
    useGetSuggestedUsers()
    return (
        <div className="flex">
            <div className="flex-grow">
				<Feed/>
				<Outlet/>
			</div>
			<RightSidebar/>
        </div>
    );
};

export default Home;
