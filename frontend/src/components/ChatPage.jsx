import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
    const dispatch = useDispatch();
    const { user, suggestedUsers, selectedUser } = useSelector(
        (store) => store.auth
    );
    const { onlineUsers, messages} = useSelector((store) => store.chat);

    const [textMessage, setTextMessage] = useState("")

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, {textMessage}, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )
            if(res.data.success){
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])

    return (
        <div className="flex ml-[16%] h-screen">
            <section className="w-full md:w-1/4 my-8">
                <h1 className="font-bold mb-4 px-3 text-xl">
                    {user?.username}
                </h1>
                <hr className="mb-4 border border-gray-400" />
                <div className="overflow-y-auto h-[80vh]">
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers?.includes(
                            suggestedUser?._id
                        )
                        return (
                            <div
                                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    dispatch(setSelectedUser(suggestedUser))
                                }
                            >
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={suggestedUser?.profilePicture}
                                        alt="profile_pic"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {suggestedUser?.username}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold ${
                                            isOnline
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {isOnline ? "online" : "offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className="flex flex-col h-full border-l border-gray-400 flex-1">
                    <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-400 sticky top-0 z-10 bg-white">
                        <Avatar>
                            <AvatarImage
                                src={selectedUser?.profilePicture}
                                alt="profile_pic"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className="flex items-center p-4 border-t border-gray-400">
                        <input
                            type="text"
                            value={textMessage}
                            className="flex-1 mr-2 focus-visible:ring-transparent"
                            placeholder="Message..."
                            onChange={(e) => setTextMessage(e.target.value)}
                        />
                        <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                    </div>
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center mx-auto">
                    <MessageCircleCode className="w-32 h-32 my-4" />
                    <h1 className="font-medium text-xl">Your messages</h1>
                    <span>Send a message to start a chat</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
