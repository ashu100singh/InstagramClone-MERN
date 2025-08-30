import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPOst from "@/hooks/useGetAllPost.jsx";

const Home = () => {
    useGetAllPOst()
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
