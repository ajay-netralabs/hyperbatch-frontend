import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    projectId: "",
    jobId: ""
}

const currentResourceSlice = createSlice({
    name : "currentResource",
    initialState,
    reducers: {
        addCurrentJob: (state, { payload }) => {
            state.jobId = payload
        },
        addCurrentProject: (state, {payload}) => {
            state.projectId = payload
        }
    }
})

export const { addCurrentJob, addCurrentProject } = currentResourceSlice.actions
export default currentResourceSlice.reducer