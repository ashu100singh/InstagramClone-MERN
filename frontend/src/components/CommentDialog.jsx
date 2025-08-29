import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ openDialog, setOpenDialog }) => {
    return (
        <div>
            <Dialog open={openDialog}>
                <DialogContent
                    onInteractOutside={() => setOpenDialog(false)}
                    className="min-w-5xl p-0 flex flex-col"
                >
                    <div className="flex flex-1">
                        <div className="flex w-1/2">
                            <img
                                src="https://tse4.mm.bing.net/th/id/OIP.XA-1C1xmsiG39LaQs1OeCgHaE8?pid=Api&P=0&h=180"
                                alt="post_img"
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="flex flex-col w-1/2 justify-between">
                            <div className="flex items-center justify-between p-4">
                                <div className=" flex gap-3 items-center">
                                    <Link>
                                        <Avatar>
                                            <AvatarImage src="" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex flex-col">
                                        <Link className="font-semibold text-xs">
                                            username
                                        </Link>
                                        {/* <span className="text-gray-600 text-sm">Bio here..</span> */}
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
                                Comments will come here
                            </div>
                            <div className=" p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        className="w-full outline-none border border-gray-300 rounded p-2"
                                    />
                                    <Button variant="outline">Send</Button>
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
