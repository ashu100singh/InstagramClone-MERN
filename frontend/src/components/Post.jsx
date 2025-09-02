import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaGrinHearts, FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);

    const [text, setText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const [liked, setLiked] = useState(
        post?.likes.includes(user?._id) || false
    );
    const [postLike, setPostLike] = useState(post?.likes?.length);

    const [comment, setComment] = useState(post?.comments);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? "dislike" : "like";
            const res = await axios.get(
                `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map((p) =>
                    p._id === post._id
                        ? {
                              ...p,
                              likes: liked
                                  ? p.likes.filter((id) => id !== user._id)
                                  : [...p.likes, user._id],
                          }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            //console.log(error)
            toast.error(error.response.data.message);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/post/${post._id}/comment`,
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                console.log(text);
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map((p) =>
                    p?._id === post?._id
                        ? { ...p, comments: updatedCommentData }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            //console.log(error)
            toast.error(error.response.data.message);
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:8000/api/v1/post/delete/${post?._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedPostData = posts.filter(
                    (postItem) => postItem?._id !== post?._id
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            //console.log(error)
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="my-8 w-full min-w-sm max-w-md mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={post?.author?.profilePicture}
                            alt="profile"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <h1>{post?.author?.username}</h1>
                        {user?._id === post?.author?._id && (
                            <Badge variant="secondary">Author</Badge>
                        )}
                    </div>
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
                        {user && user?._id === post?.author?._id && (
                            <Button
                                variant="ghost"
                                className="cursor-pointer w-fit"
                                onClick={deletePostHandler}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={post?.image}
                alt="post_img"
            />

            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {liked ? (
                        <FaHeart
                            size={24}
                            className="cursor-pointer text-red-500 hover:text-red-600 "
                            onClick={likeOrDislikeHandler}
                        />
                    ) : (
                        <FaRegHeart
                            size={24}
                            className="cursor-pointer hover:text-gray-600 "
                            onClick={likeOrDislikeHandler}
                        />
                    )}

                    <MessageCircle
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpenDialog(true);
                        }}
                        className="cursor-pointer hover:text-gray-600"
                    />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="block font-medium text-sm mb-2">
                {postLike} likes
            </span>
            <p>
                <span className="font-medium mr-2">
                    {post?.author?.username}
                </span>
                {post?.caption}
            </p>
            {comment?.length > 0 && (
                <span
                    className="cursor-pointer text-sm text-gray-400"
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpenDialog(true);
                    }}
                >
                    View all {comment?.length} comments
                </span>
            )}

            <CommentDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                post={post}
            />
            <div className="flex ice justify-between">
                <input
                    type="text"
                    value={text}
                    placeholder="Add a comment..."
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {text && (
                    <span
                        onClick={commentHandler}
                        className="text-[#3BADF8] cursor-pointer"
                    >
                        Post
                    </span>
                )}
            </div>
        </div>
    );
};

export default Post;
