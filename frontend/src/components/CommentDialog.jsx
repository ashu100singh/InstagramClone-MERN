import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice.js";

const CommentDialog = ({ openDialog, setOpenDialog}) => {

    const dispatch = useDispatch()
    const {posts} = useSelector(store=>store.post)
    const {selectedPost} = useSelector((state) => state.post)
    const [text, setText] = useState("")
    const [comment, setComment] = useState([])

    useEffect(() => {
        if(selectedPost){
            setComment(selectedPost?.comments)
        }
    }, [selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value  
        if(inputText.trim()){
            setText(inputText)
        }
        else{
            setText("")
        }
    }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(
                `https://instagramclone-mern.onrender.com/api/v1/post/${selectedPost._id}/comment`, 
                {text}, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )

            if(res.data.success){
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map(p => 
                    p._id === selectedPost._id ? {...p, comments: updatedCommentData} : p
                )

                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            
            toast.error(error.response.data.message)
        }
    }

    return (
        <div>
            <Dialog open={openDialog}>
                <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    className="min-w-4xl max-w-5xl p-0 flex flex-col"
                >
                    <div className="flex flex-1">
                        <div className="flex w-1/2">
                            <img
                                src={selectedPost?.image}
                                alt="post_img"
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="flex flex-col w-1/2 justify-between">
                            <div className="flex items-center justify-between p-4">
                                <div className=" flex gap-3 items-center mt-3">
                                    <Link>
                                        <Avatar>
                                            <AvatarImage src={selectedPost?.author?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex flex-col">
                                        <Link className="font-semibold text-xs">
                                            {selectedPost?.author?.username}
                                        </Link>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className="cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent className="flex flex-col items-center text-sm text-center">
                                        <div className="w-full cursor-pointer text-[#ED4956] font-bold">
                                            Unfollow
                                        </div>
                                        <div className="w-full cursor-pointer">
                                            Add to favorites
                                        </div>                                        
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr />
                            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                                {
                                    selectedPost?.comments.map((comment) => (<Comment key={comment?._id} comment={comment}/>))
                                }
                            </div>
                            <div className=" p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={text}
                                        onChange={changeEventHandler}
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                    <Button disabled={!text.trim()} variant="outline" onClick={sendMessageHandler}>Send</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommentDialog;
