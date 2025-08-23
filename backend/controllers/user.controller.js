import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'

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
    
}