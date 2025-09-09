import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);
	const { userProfile, user } = useSelector((store) => store.auth);

    const isLoggedInUserProfile = user?._id === userId

    const isFollowing = false;

	const [activeTab, setActiveTab] = useState('posts')
	const handleTabChange = (tab) => {
		setActiveTab(tab)
	}

	const displayPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

    return (
        <div className="flex max-w-5xl justify-center mx-auto pl-10 mt-1">
            <div className="flex flex-col p-8">
                <div className="grid grid-cols-2 border-b border-gray-400 pb-10">
                    <section className="flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage
                                src={userProfile?.profilePicture}
                                alt="profile_img"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </section>
                    <section>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-2xl">
                                    {userProfile?.username}
                                </span>
                                {isLoggedInUserProfile ? (
                                    <div className="flex gap-2">
										<Link to='/profile/edit'>
											<Button
												variant="outline"
												className="hover:bg-gray-100 h-9"
											>
												Edit Profile
											</Button>
										</Link>
                                        <Button
												variant="outline"
												className="hover:bg-gray-100 h-9"
											>
                                            View archive
                                        </Button>
                                        <Button
												variant="outline"
												className="hover:bg-gray-100 h-9"
											>
                                            Ad tools
                                        </Button>
                                    </div>
                                ) : isFollowing ? (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="h-9 bg-gray-200 hover:bg-gray-300"
                                        >
                                            Unfollow
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-9"
                                        >
                                            Message
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        className="bg-[#26a6fc] hover:bg-[#1385d0] h-9"
                                    >
                                        Follow
                                    </Button>
                                )}
                            </div>
							<div className="flex items-center gap-6 mt-2">
								<div className="text-center">
                                    <span className="font-bold text-lg">{userProfile?.posts.length}</span>
                                    <p className="text-sm text-gray-500">Posts</p>
                                </div>
                                <div className="text-center cursor-pointer hover:underline">
                                    <span className="font-bold text-lg">{userProfile?.followers.length}</span>
                                    <p className="text-sm text-gray-500">Followers</p>
                                </div>
                                <div className="text-center cursor-pointer hover:underline">
                                    <span className="font-bold text-lg">{userProfile?.following.length}</span>
                                    <p className="text-sm text-gray-500">Following</p>
                                </div>
							</div>
                            <div className="mt-3 flex flex-col gap-2">
                                {userProfile?.bio && (
                                    <p className="text-sm text-gray-700">{userProfile.bio}</p>
                                )}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                                        <AtSign size={14} />
                                        <span>{userProfile?.username}</span>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-10 text-sm">
                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('posts')}>
							POSTS
						</span>
                        <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('saved')}>
							SAVED
						</span>
                        <span className={`py-3 cursor-pointer}`}>
							REELS
						</span>
                        <span className={`py-3 cursor-pointer`}>
							TAGS
						</span>
                    </div>
					<div className="grid grid-cols-3 gap-2 mt-4">
						{
                            displayPost && displayPost.length > 0 ? (
                                displayPost?.map((post) => {
                                    return (
                                        <div key={post?._id} className="relative group cursor-pointer rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                            <img 
                                                src={post?.image} 
                                                alt="post_image" 
                                                className="rounded-sm w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex items-center gap-6 text-white font-semibold">
                                                    <button className="flex items-center gap-2 hover:text-gray-100">
                                                        <Heart className="w-5 h-5"/>
                                                        <span>{post?.likes.length}</span>
                                                    </button>
                                                    <button className='flex items-center gap-2 hover:text-gray-100'>
                                                        <MessageCircle className="w-5 h-5"/>
                                                        <span>{post?.comments.length}</span>
                                                    </button>
                                                </div>	
                                            </div>
                                        </div>

                                    
                                    )
                                })
                            ) : (
                                <div className="col-span-3 flex flex-col items-center justify-center py-9 text-gray-500">
                                    <span className="text-xl font-semibold">
                                        {activeTab === "posts"
                                        ? "No posts yet 😶"
                                        : "No saved posts yet 🔖"}
                                    </span>
                                    <p className="text-sm mt-1">
                                        {activeTab === "posts"
                                        ? "Start sharing your memories!"
                                        : "Save posts to see them here."}
                                    </p>
                                </div>
                            )
						}
					</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
