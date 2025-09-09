import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessages();

    const { user } = useSelector((store) => store.auth);
    const { messages } = useSelector((store) => store.chat);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="overflow-y-auto flex-1 p-4 bg-gray-50 rounded-md shadow-inner">
            {/* Selected User Info */}
            <div className="flex justify-center mb-5">
                <div className="flex flex-col items-center justify-center text-center">
                    <Avatar className="h-20 w-20 border">
                        <AvatarImage
                            src={selectedUser?.profilePicture}
                            alt="profile"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="mt-2 font-semibold text-gray-800">
                        {selectedUser?.username}
                    </span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button
                            className="h-8 mt-2"
                            variant="secondary"
                        >
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex flex-col gap-3">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isSender = msg.senderId === user?._id;

                        return (
                            <div
                                key={index}
                                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 max-w-xs md:max-w-md rounded-2xl shadow-sm relative ${
                                        isSender
                                            ? "bg-[#3797f0] text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                                    }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500 text-sm italic">
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Messages;
