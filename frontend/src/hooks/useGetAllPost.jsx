import { useEffect } from "react"
import { setPosts } from "@/redux/postSlice.js"
import axios from 'axios'
import { useDispatch } from "react-redux"


const useGetAllPOst = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllPost = async() => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/post/all-posts', {withCredentials: true})
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPost()
    }, [])

}

export default useGetAllPOst; 