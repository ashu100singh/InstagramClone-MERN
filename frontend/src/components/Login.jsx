import React, { useState } from 'react'
import axios from 'axios'

import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Login = () => {

    const [input, setInput] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    const signupHandler = async(e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            })
            if(res.data.success){
                navigate('/')
                toast.success(res.data.message)
                setInput({
                    email: '',
                    password: ''
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='flex w-screen h-screen items-center justify-center'>
        <form
            onSubmit={signupHandler} 
            className='flex flex-col shadow-lg gap-5 p-8'
        >
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>Logo</h1>
                <p className='text-center text-sm'>Login to see photos & videos from your friends</p>
            </div>
            <div>
                <Label htmlFor='email' className="font-medium py-2">
                    Email
                </Label>
                <Input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className=' focus-visible:ring-transparent'
                />
            </div>
            <div>
                <Label htmlFor='password' className="font-medium py-2">
                    Password
                </Label>
                <Input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    className=' focus-visible:ring-transparent'
                />
            </div>
            {
                loading ? 
                (
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Please Wait...
                    </Button>
                ) : 
                (
                    <Button type='submit'>
                        Login
                    </Button>
                )
            } 
            <span className='text-center'>
                Don't have an account?&nbsp;
                <Link
                    to='/signup'
                    className='text-blue-700'
                >
                    Sign up
                </Link>
            </span>
        </form>
    </div>
  )
}

export default Login