import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice.js";
import { Badge } from "./ui/badge";
import { setAuthUser } from "@/redux/authSlice";

const Post = ({ post }) => {
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    console.log(user)

    const [text, setText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const [liked, setLiked] = useState(
        post?.likes.includes(user?._id) || false
    );
    const [postLike, setPostLike] = useState(post?.likes?.length);

    const [comment, setComment] = useState(post?.comments);
    const [bookmarked, setBookmarked] = useState(() =>
        user?.bookmarks?.includes(post?._id) || false
    );

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

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
            if (res.data.success) {
                setBookmarked(!bookmarked)

                const updatedUser = {
                    ...user,
                    bookmarks: res.data.type === "BOOKMARKED"
                        ? [...user?.bookmarks, post?._id]
                        : user.bookmarks.filter((id) => id !== post._id)
                }

                dispatch(setAuthUser(updatedUser))

                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="my-8 w-full max-w-md mx-auto rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={post?.author?.profilePicture} alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold">{post?.author?.username}</h1>
                            {user?._id === post?.author?._id && (
                                <Badge variant="secondary">Author</Badge>
                            )}
                        </div>
                        <span className="text-xs text-gray-400">
                            {new Date(post?.createdAt).toLocaleDateString()} •{" "}
                            {new Date(post?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant="ghost" className="w-fit font-bold text-[#ED4956]">
                            Unfollow
                        </Button>
                        <Button variant="ghost" className="w-fit">
                            Add to Favorites
                        </Button>
                        {user && user?._id === post?.author?._id && (
                            <Button
                                variant="ghost"
                                className="w-fit"
                                onClick={deletePostHandler}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <img
                className="w-full object-cover aspect-square"
                src={post?.image}
                alt="post_img"
            />

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    {liked ? (
                        <FaHeart
                            size={24}
                            className="cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-200"
                            onClick={likeOrDislikeHandler}
                        />
                    ) : (
                        <FaRegHeart
                            size={24}
                            className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
                            onClick={likeOrDislikeHandler}
                        />
                    )}
                    <MessageCircle
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpenDialog(true);
                        }}
                        className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    />
                    <Send className="cursor-pointer hover:text-gray-600 transition-colors duration-200" />
                </div>
                {bookmarked ? (
                    <FaBookmark
                        onClick={bookmarkHandler}
                        className="cursor-pointer text-[#ED4956] hover:text-red-600 transition-colors duration-200"
                        size={24}
                    />
                ) : (
                    <FaRegBookmark
                        onClick={bookmarkHandler}
                        className="cursor-pointer hover:text-gray-600 transition-colors duration-200"
                        size={24}
                    />
                )}
            </div>

            {/* Likes */}
            <div className="px-4">
                <span className="font-medium text-sm">{postLike} likes</span>
            </div>

            {/* Caption */}
            <div className="px-4 py-1">
                <p className="text-sm">
                    <span className="font-semibold mr-2">{post?.author?.username}</span>
                    <span className="line-clamp-2">{post?.caption}</span>
                </p>
            </div>

            {/* View Comments */}
            {comment?.length > 0 && (
                <div className="px-4 py-1">
                    <span
                        className="cursor-pointer text-sm text-gray-400"
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpenDialog(true);
                        }}
                    >
                        View all {comment?.length} comments
                    </span>
                </div>
            )}

            {/* Comment Input */}
            <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-200">
                <input
                    type="text"
                    value={text}
                    placeholder="Add a comment..."
                    onChange={changeEventHandler}
                    className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-blue-400 outline-none"
                />
                {text && (
                    <span
                        onClick={commentHandler}
                        className="text-[#3BADF8] font-semibold cursor-pointer"
                    >
                        Post
                    </span>
                )}
            </div>

            {/* Comment Dialog */}
            <CommentDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                post={post}
            />
        </div>

    );
};

export default Post;
