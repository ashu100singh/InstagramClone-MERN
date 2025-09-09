import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode, Send, Search, Paperclip, Smile } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
    const dispatch = useDispatch();
    const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
    const { onlineUsers, messages } = useSelector((store) => store.chat);

    const [textMessage, setTextMessage] = useState("");

    const sendMessageHandler = async (receiverId) => {
        try {
            if (!textMessage.trim()) return;

            const res = await axios.post(
                `https://instagramclone-mern.onrender.com/api/v1/message/send/${receiverId}`,
                { textMessage },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);

    return (
        <div className="flex ml-[16%] h-screen border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            {/* LEFT SIDEBAR */}
            <section className="w-full md:w-1/4 bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="font-bold text-lg text-gray-800">{user?.username}</h1>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-gray-100 rounded-full mx-3 my-3 px-3 shadow-sm">
                    <Search className="text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent flex-1 p-2 focus:outline-none text-sm"
                    />
                </div>

                {/* Suggested Users */}
                <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300">
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers?.includes(suggestedUser?._id);
                        const isActive = selectedUser?._id === suggestedUser?._id;

                        return (
                            <div
                                key={suggestedUser?._id}
                                className={`flex gap-3 items-center p-3 cursor-pointer rounded-lg transition ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                            >
                                <div className="relative">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={suggestedUser?.profilePicture}
                                            alt="profile_pic"
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    {isOnline && (
                                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-md"></span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">
                                        {suggestedUser?.username}
                                    </span>
                                    <span
                                        className={`text-xs ${
                                            isOnline ? "text-green-600" : "text-gray-400"
                                        }`}
                                    >
                                        {isOnline ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CHAT SECTION */}
            {selectedUser ? (
                <section className="flex flex-col h-full flex-1 bg-white">
                    {/* Chat Header */}
                    <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={selectedUser?.profilePicture} alt="profile_pic" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold">{selectedUser?.username}</span>
                            <span className="text-xs text-gray-500">
                                {onlineUsers?.includes(selectedUser?._id) ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 bg-gray-50 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-gray-300">
                        <Messages selectedUser={selectedUser} />
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-gray-50">
                        <button className="p-2 hover:bg-gray-200 rounded-full transition">
                            <Paperclip className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-full transition">
                            <Smile className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                            type="text"
                            value={textMessage}
                            className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Type a message..."
                            onChange={(e) => setTextMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessageHandler(selectedUser?._id)}
                        />
                        <Button
                            onClick={() => sendMessageHandler(selectedUser?._id)}
                            className="rounded-full p-2 bg-blue-500 hover:bg-blue-600 shadow-md"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </section>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
                    <MessageCircleCode className="w-32 h-32 text-gray-300" />
                    <h1 className="font-semibold text-xl mt-4">Your Messages</h1>
                    <span className="text-gray-500">Select a chat to start messaging</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
