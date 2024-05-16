import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IJob {
  project_id: string;
  job_id : string;
  name: string;
  description: string;
  project_name:string;
  date_created: string;
  business_logic?: string;
  program_summary?: string;
  sql_code?: string;
  refined_sql_code?: string;
}

interface JobsState {
  jobs: IJob[];
}

const initialState: JobsState = {
  jobs: [],
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
      addJob(state, action: PayloadAction<IJob[]>) {
        const newjobs = action.payload.filter(newJob => {
          return !state.jobs.some(existingJob => existingJob.job_id === newJob.job_id);
        });
        
        state.jobs = [...state.jobs, ...newjobs];
      },
      addOne : (state, {payload}) => {
        state.jobs = [...state.jobs, payload]
      },
      updateOne : (state, {payload}) => {
        state.jobs = state.jobs.map(job => {
          if(job.job_id === payload.job_id){
            return {
              ...job,
              ...payload
            }
          }else return job
        })
      },
      deleteJob : (state, {payload}) => {
        state.jobs = state.jobs.filter(job => job.job_id !== payload.job_id)
      }
      
    },
  });

export const { addJob, addOne, updateOne,deleteJob } = jobsSlice.actions;

export default jobsSlice.reducer;
