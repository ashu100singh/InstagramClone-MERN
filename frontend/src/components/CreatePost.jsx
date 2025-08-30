import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const CreatePost = ({ open, setOpen }) => {

	const imageRef = useRef()
	const [file, setFile] = useState("")
	const [caption, setCaption] = useState("")
	const [imagePreview, setImagePreview] = useState("")
	const [loading, setLoading] = useState(false)

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0]
		if(file){
			setFile(file)
			const dataUrl = await readFileAsDataURL(file)
			setImagePreview(dataUrl)
		}
	}

	const createPostHandler = async (e) => {
		const formData = new FormData()
		formData.append("caption", caption)
		if(imagePreview){
			formData.append("image", file)
		}
		try {
			setLoading(true)
			const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			})
			if(res.data.success){
				toast.success(res.data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
		}
	}

    return (
        <div>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
					<DialogHeader className='text-center font-semibold text-lg'>Create New Post</DialogHeader>
					<div className="flex gap-3 items-center">
						<Avatar>
							<AvatarImage src="" alt="post_img" />
							<AvatarFallback>CN</AvatarFallback>						
						</Avatar>
						<div>
							<h1 className="font-semibold text-sm">username</h1>
							<span className="text-gray-600 text-sm">Bio here...</span>
						</div>
					</div>
					<Textarea 
						className='border-none focus-visible:ring-transparent' 
						placeholder="Write a caption" 
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
					/>
					{
						imagePreview && (
							<div className="flex w-full h-64 items-center justify-center">
								<img src={imagePreview} alt="post_preview" className="h-full w-full rounded-md object-cover"/>
							</div>
						)
					}
					<input
						type="file"
						className="hidden"
						ref={imageRef}
						onChange={fileChangeHandler}
					/>
					<Button 
						className="w-fit mx-auto bg-[#0095F6] hover:bg-[#0b5193]"
						onClick ={() => imageRef.current.click()}
					>
						Select from computer
					</Button>
					{
						imagePreview && (
							loading ? 
							(
								<Button>
									<Loader2 className="h-4 w-4 mr-2 animate-spin"/>
									Please Wait...
								</Button>
							) : 
							(
								<Button 
									type='submit' 
									className='w-full'
									onClick={createPostHandler}
								>
									Post
								</Button>
							)
						)
					}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreatePost;
