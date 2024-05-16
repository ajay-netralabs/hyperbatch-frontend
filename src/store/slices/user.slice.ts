import { createSlice } from "@reduxjs/toolkit";



interface User {
    id: string;
    email: string;
    name: string;
}

interface UserState {
    user: User | null
}

const initialState:UserState = {
    user: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, { payload }) => {
            state.user = payload
          },
          logoutUser : (state) => {
             state.user = null
          },
    },
  })

  export const { login, logoutUser } = userSlice.actions

export default userSlice.reducer