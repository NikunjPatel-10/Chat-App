import { createSlice } from "@reduxjs/toolkit"

const initialState = {
onlineUser : [],
socketConnection:false
}

 const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setOnlineUser : (state, action)=>{
            state.onlineUser = action.payload
        }, 
        setSocketConnection : (state, action)=>{
            state.socketConnection = action.payload
        }
    }
})

export const {setOnlineUser, setSocketConnection} = userSlice.actions;
export const userReducer = userSlice.reducer
