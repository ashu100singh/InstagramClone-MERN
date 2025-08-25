import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import getDataUri from '../utils/datauri.js'
import cloudinary from '../utils/cloudinary.js'

dotenv.config()

export const register = async (req, res) => {
    try{
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(401).json({
                message: 'Please fill all the fields',
                success: false
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                message: 'Account is already created with this email, try different email',
                success: false
            })
        }

        const hashedPassword = bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })
    }
    catch(error){
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({
                message: 'Something is missing, please fill all the fields',
                success: false
            })
        }
        
        let user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message: 'Account is not created with this email, please create an account first',
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                message: 'Password did not match, Please enter your correct password',
                success: false
            })
        }

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        const token = await jwt.sign(
            {userId: user._id},
            process.env.SECRET_KEY,
            {expiresIn: "24h"}
        )
        return res.cookie('token', token, {httpOnly: true, sameSite: 'strict', maxAge: 2*24*60*60*1000}).json({
            message: `Welcome Back ${user.username}`,
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
    }
}

export const logout = async (_, res) => {
    try {
       return res.cookie('token', '', {maxAge: 0}).json({
        message: 'Logged out successfully',
        success: true
       })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async(req, res) => {
    try {
        const userId = req.params.id
        let user = await User.findById(userId)

        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const editProfile = async(req, res) => {
    try {
        const userId = req.id
        const {bio, gender} = req.body
        const profilePicture = req.file
        let cloudResponse 
        
        if(profilePicture){
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if(bio){
            user.bio = bio
        }
        if(gender){
            user.gender = gender
        }
        if(profilePicture){
            user.profilePicture = cloudResponse.secure_url
        }

        await user.save()

        return res.status(200).json({
            user,
            success: true,
            message: 'Profile updated'
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSuggestedUsers = async(req, res) => {
    try {
        const suggestedUsers = await User.find({_id: {$ne: req.id}}).select("-password")
        if(!suggestedUsers){
            return res.status(400).json({
                success: false,
                message: "Currently do not have any users"
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers,
            message: "All other users fetched"
        })
    } catch (error) {
        console.log(error)
    }
}