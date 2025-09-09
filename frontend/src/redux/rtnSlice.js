import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: "realTimeNotification",
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            const { type, userId, postId } = action.payload;

            if (type === "like") {
                const exists = state.likeNotification.some(
                    (item) => item.userId === userId && item.postId === postId
                );
                if (!exists) {
                    state.likeNotification = [action.payload, ...state.likeNotification]; // ✅ Add latest on top
                }
            } else if (type === "dislike") {
                state.likeNotification = state.likeNotification.filter(
                    (item) => !(item.userId === userId && item.postId === postId)
                );
            }
        },
        clearNotifications: (state) => {
            state.likeNotification = [];
        },
    },
});

export const { setLikeNotification, clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
