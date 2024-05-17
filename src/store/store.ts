import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './slices/sidebar.slice'
import projectsReducer from './slices/project.slice';
import jobsReducer from "./slices/job.slice"
import currentResources from './slices/currentResources';
import variableReducer from "./slices/variables.slice"
import userReducer from "./slices/user.slice"
import fetchedResources from './slices/fetchedResources';

export const store = configureStore({
  reducer: {
    sidebar : sidebarReducer,
    projects: projectsReducer,
    jobs: jobsReducer,
    selectedResource : currentResources,
    variables : variableReducer,
    user: userReducer,
    fetchedResources : fetchedResources
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch