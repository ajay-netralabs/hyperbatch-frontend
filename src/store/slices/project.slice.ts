import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
    project_id: string;
    name: string;
    description: string;
    filePath : string;
    cobol_program: string;
    date_created: string;
}

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
      addProject(state, action: PayloadAction<Project[]>) {
        const newProjects = action.payload.filter(newProject => {
          return !state.projects.some(existingProject => existingProject.project_id === newProject.project_id);
        });
        
        state.projects = [...state.projects, ...newProjects];
      },

      deleteProject : (state, {payload}) => {
        state.projects = state.projects.filter(project => project.project_id !== payload.project_id)},
        
      addOne : (state, { payload }) => {
        state.projects = [...state.projects, payload]
      },
      updateOne : (state, { payload }) => {
        state.projects = state.projects.map(project => {
          if(project.project_id === payload.project_id){
            return {
              ...project,
              ...payload
            }
          }else return project
        })
      }
    },
  });
  

export const { addProject, addOne, updateOne,deleteProject } = projectsSlice.actions;

export default projectsSlice.reducer;
