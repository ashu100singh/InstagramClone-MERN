import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { Comment } from '../models/comment.model.js'


export const addNewPost = async(req, res) => {
    try {
        const {caption} = req.body
        const authorId = req.id
        const image = req.file
        if(!image){
            return res.status(400).json({
                success: false,
                message: "File to be uploaded is required"
            })
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({width: 800, height:800, fit: "inside"})
            .toFormat('jpeg', {quality: 80})
            .toBuffer()

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId)
        if(user){
            user.posts.push(post._id)
            await user.save()

        }

        await post.populate({path:'author', select:'-password'})

        return res.status(200).json({
            success: true,
            message: "Post uploaded successfully"
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getAllPost = async(req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
            .populate({path: 'author', select: 'username profilePicture'})
            .populate(
                {
                    path: 'comments',
                    sort: {createdAt: -1},
                    populate: {
                        path: 'author',
                        select: 'username profilePicture'
                    }
                }
            )

            return res.status(200).json({
                posts,
                success: true
            })
    } catch (error) {
        console.log(error)
    }
}

export const getUserPost = async(req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({author: authorId}).sort({createdAt:-1}).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        })

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const likePost = async(req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            })
        }

        await post.updateOne({
            $addToSet: {likes: userId}
        })
        await post.save()

        return res.status(200).json({
            success: true,
            message: "Post liked "
        })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async(req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            })
        }

        await post.updateOne({
            $pull: {likes: userId}
        })
        await post.save()

        return res.status(200).json({
            success: true,
            message: "Post disliked "
        })
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async(req, res) => {
    try {
        const commentedByUserId = req.id
        const postId = req.params.id

        const {text} = req.body
        if(!text){
            return res.status(401).json({
                success: false,
                message: "please enter something, comment is empty"
            })
        }

        const post = await Post.findById(postId)
        const newComment = await Comment.create({
            text,
            author: commentedByUserId,
            post: postId
        });
        const comment = await Comment.findById(newComment._id)
            .populate({ path: "author", select: "username profilePicture" });

        post.comments.push(comment._id)
        await post.save()

        return res.status(201).json({
            success: true,
            message: 'Commented successfully',
            comment
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllCommentsOfPost = async(req, res) => {
    try {   
       const postId = req.params.id
       const comments = await Comment.find({post: postId}).populate('author', 'username profilePicture') 
       if(!comments){

        return res.status(404).json({
            success:false,
            message: 'Comments not found'
        })
       }
       return res.status(200).json({
        comments,
        success: true
       })
    } catch (error) {
       console.log(error) 
    }
}

export const deletePost = async(req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id

        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success: false,
                mesage: 'Post not found'
            })
        }

        // checking of the logged-in user is the owner of the post
        if(post.author.toString() !== authorId){
            return res.status(403).json({
                success: false,
                message: 'Unauthorized request, You cannot delete someone else post'
            })
        }

        //delete post from Post model
        await Post.findByIdAndDelete(postId)

        //alse remove the post from User model
        let user = await User.findById(authorId)
        user.posts = user.posts.filter(id => id.toString() !== postId)

        await user.save()

        //also delete all the comments of the deleted post
        await Comment.deleteMany({post: postId})

        return res.status(200).json({
            success: true,
            message: 'Post deleted Successfully'
        })

    } catch (error) {
        console.log(error)
    }
}

export const bookmarkPost = async(req, res) => {
    try {
        const postId = req.params.id
        const authorId = req.id

        const post = await Post.findById(postId)
        if(!post){
            return res.status(200).json({
                success: false,
                message:'Post not found'
            })
        }

        const user = await User.findById(authorId)
        if(user.bookmarks.includes(post._id)){
            //already bookmarked, remove from the array
            await user.updateOne({$pull:{bookmarks: post._id}})
            await user.save()

            return res.status(201).json({type: 'unsaved', mesage: 'Post removed from Bookmark'})
        }
        else{
            //add to bookmarks
            await user.updateOne({$addToSet: {bookmarks: post._id}})
            await user.save()
        
            return res.status(200).json({type: 'saved', message: 'Post bookmarked', success: true})
        }
    } catch (error) {
        console.log(error)
    }
}