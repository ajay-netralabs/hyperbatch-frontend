import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// business_rules : string;
//     code_rules: string;
//     program_summary_ex : string;
//     corrections : string;
//     incorrect_code_ex : string;
//     corrected_code_ex : string;
export interface VarListItem {
    var: string;
    type: string;
    content: any;
}

export interface Variable {
    var_id: string;
    name: string;
    description: string;
    var_list : VarListItem[];
    date_created: string;
}

interface VariableState {
  variables: Variable[];
}

const initialState: VariableState = {
    variables: [],
};

const variableSlice = createSlice({
    name: 'variables',
    initialState,
    reducers: {
      addVariable(state, action: PayloadAction<Variable[]>) {
        const newVariables = action.payload.filter(newVariable=> {
          return !state.variables.some(existingVariable => existingVariable.var_id === newVariable.var_id);
        });
        
        state.variables = [...state.variables, ...newVariables];
      },

      deleteVariable : (state, {payload}) => {
        state.variables = state.variables.filter(project => project.var_id !== payload.var_id)},
        
      addOne : (state, { payload }) => {
        state.variables = [...state.variables, payload]
      },
      updateOne : (state, { payload }) => {
        state.variables = state.variables.map(variable => {
          if(variable.var_id === payload.var_id){
            return {
              ...variable,
              ...payload
            }
          }else return variable
        })
      }
    },
  });
  

export const { addVariable, addOne, updateOne,deleteVariable } = variableSlice.actions;

export default variableSlice.reducer;
