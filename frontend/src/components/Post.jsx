import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {

    const [text, setText] = useState("")
    const [openDialog, setOpenDialog] = useState(false)

    const changeEventHandler = (e) => {
        const inputText = e.target.value
        if(inputText.trim()){
            setText(inputText)
        }
        else{
            setText("")
        }
    }

    return (
        <div className="my-8 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="" alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-fit font-bold text-[#ED4956]"
                        >
                            Unfollow
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-fit"
                        >
                            Add to Favorites
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer w-fit"
                        >
                            Delete
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src="https://tse4.mm.bing.net/th/id/OIP.XA-1C1xmsiG39LaQs1OeCgHaE8?pid=Api&P=0&h=180"
                alt="post_img"
            />

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    <FaRegHeart
                        size={"22px"}
                        className="cursor-pointer hover:text-gray-600 "
                    />
                    <MessageCircle onClick={() => setOpenDialog(true)} className="cursor-pointer hover:text-gray-600" />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="block font-medium text-sm mb-2">449k Likes</span>
            <p>
                <span className="font-medium mr-2">username</span>
                caption
            </p>
            <span className="cursor-pointer text-sm text-gray-400" onClick={()=>setOpenDialog(true)}>View all comments</span>
            <CommentDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
            <div className="flex ice justify-between">
                <input
                    type="text"
                    value={text}
                    placeholder="Add a comment..."
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {
                    text && <span className="text-[#3BADF8]">Post</span>
                } 
            </div>
        </div>
    );
};

export default Post;
