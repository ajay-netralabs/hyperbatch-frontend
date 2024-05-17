import { createSlice } from '@reduxjs/toolkit'

interface fetchState {
  jobs: boolean,
  projects: boolean,
  variables: boolean
}

const initialState: fetchState = {
    jobs: false,
    projects: false,
    variables: false
}


export const fetchSlice = createSlice({
  name: 'fetchedResources',
  initialState,
  reducers: {
    addFetch : (state:any, { payload }) => {
        state[payload] = true
    },
    removeFetch : (state:any, { payload }) => {
        state[payload] = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { addFetch, removeFetch } = fetchSlice.actions

export default fetchSlice.reducer