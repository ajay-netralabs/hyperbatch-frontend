import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface sidebarState {
  open: boolean
}

const initialState = {
  open: true,
}


export const counterSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
        state.open = !state.open
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleSidebar } = counterSlice.actions

export default counterSlice.reducer