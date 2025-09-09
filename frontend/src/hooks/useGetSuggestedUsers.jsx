import { useEffect } from "react"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { setSuggestedUser } from "@/redux/authSlice"


const useGetSuggestedUsers = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchSuggestedUsers = async() => {
            try {
                const res = await axios.get('https://instagramclone-mern.onrender.com/api/v1/user/suggested', {withCredentials: true})
                if(res.data.success){
                    dispatch(setSuggestedUser(res.data.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedUsers()
    }, [])

}

export default useGetSuggestedUsers; 