import { useEffect } from "react"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "@/redux/chatSlice"


const useGetAllMessages = () => {

    const dispatch = useDispatch()
    const {selectedUser} = useSelector(store=>store.auth)

    useEffect(() => {
        const fetchAllMessages = async() => {
            try {
                const res = await axios.get(`https://instagramclone-mern.onrender.com/api/v1/message/all-messages/${selectedUser?._id}`, {withCredentials: true})
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllMessages()
    }, [selectedUser, dispatch])

}

export default useGetAllMessages; 