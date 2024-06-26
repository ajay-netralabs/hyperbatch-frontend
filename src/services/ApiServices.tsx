import { GET_ALL_JOBS, 
    GET_ALL_PROJECTS, 
    GET_AWS_DATA, 
    CREATE_PROJECT, 
    UPDATE_PROJECT,
    BUSINESS_LOGIC, 
    PROGRAM_SUMMARY, 
    HYPERBATCH_CODE, 
    REFINE_HYPERBATCH_CODE,
    DELETE,
  FINAL_SQL_CODE,
  GET_ALL_VARIABLES,
CREATE_VARIABLE,
CREATE_JOB,
UPDATE_JOB } 
    from "./urls";

interface IJobs {
    job_id: string;
    name: string;
    description: string;
    project_id : string;
    project_name : string;
    business_logic : string;
    cobol_program : string;
    program_summary : string;
    date_created: string;
    sql_code : string;
    refined_sql_code : string;
  }

  interface IProjects {
    project_id: string;
    name: string;
    description: string;
    filePath : string;
    cobol_program: string;
    date_created: string;
  }

interface IVariables {
  var_id: string;
  name: string;
  description: string;
  var_list : any[];
  date_created: string;
}

export async function getAllJobs(token : string) {
    try {
      let jobs: IJobs[] = [];
      const res = await fetch(GET_ALL_JOBS, {
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        return jobs;
      }
      const result = await res.json();
      if (result.error === true) {
        return result.message;
      }
      for (const item of result.message) {
        jobs.push({ ...item, job_id: item._id });
      }
      return jobs;
    } catch (error) {
      console.log("job fetch error: ", error);
    }
  }

export async function getAllProjects(token:string) {
    try {
      let projects: IProjects[] = [];
      const res = await fetch(GET_ALL_PROJECTS,{
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        return projects;
      }
      const result = await res.json();
      if (result.error === true) {
        return result.message;
      }
      for (const item of result.message) {
        projects.push({ ...item, project_id : item._id});
      }
      return projects;
    } catch (error) {
      console.log("job fetch error: ", error);
    }
  }

export async function createProject(
    project_name : string,
    project_description : string,
    date_created : string,
    input_files: any[],
    output_files: any[],
    token:string
  ) {
    try {
      const res = fetch(CREATE_PROJECT, {
        method: "POST",
        body: JSON.stringify({
          project_name,
          project_description,
          input_files,
          date_created,
          output_files
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function updateProject(
    project_id : string,
    project_name : string,
    project_description : string,
    date_created : string,
    input_files : any[],
    output_files : [],
    token : string
  ) {
    try {
      const res = fetch(UPDATE_PROJECT, {
        method: "POST",
        body: JSON.stringify({
          project_id,
          project_name,
          project_description,
          date_created,
          input_files,
          output_files
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }


  export async function updateProjectFiles(project:any, token:string) {
    try {
      const res = fetch(UPDATE_PROJECT, {
        method: "POST",
        body: JSON.stringify(project),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function createJob(
    job_name : string,
    job_description : string,
    date_created : string,
    project_id : string,
    project_name: string,
    token:string
  ) {
    try {
      const res = fetch(CREATE_JOB, {
        method: "POST",
        body: JSON.stringify({
          job_name,
          job_description,
          date_created,
          project_id,
          project_name
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function updatejob(
    job_id : string,
    job_name : string,
    job_description : string,
    token:string
  ) {
    try {
      const res = fetch(UPDATE_JOB, {
        method: "POST",
        body: JSON.stringify({
          job_id,
          job_name,
          job_description
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getBusinessLogic(
    project_id : string,
    job_name : string,
    job_description : string,
    date_created : string,
    // var_id : string,
    token : string
    
  ) {
    try {
      const res = fetch(BUSINESS_LOGIC, {
        method: "POST",
        body: JSON.stringify({
            project_id,
            job_name,
            job_description,
            date_created,
            // var_id
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

export async function getProgramSummary(
    job_id : string,
    business_logic : string,
    token:string 
  ) {
    try {
      const res = fetch(PROGRAM_SUMMARY, {
        method: "POST",
        body: JSON.stringify({
            job_id,
            business_logic
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

export async function getHyperbatchCode(
    job_id : string,
    program_summary : string ,
    token :string
  ) {
    try {
      const res = fetch(HYPERBATCH_CODE, {
        method: "POST",
        body: JSON.stringify({
            job_id,
            program_summary
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }
export async function getRefinedHyperbatchCode(
    job_id : string,
    sql_code : string,
    token: string
  ) {
    try {
      const res = fetch(REFINE_HYPERBATCH_CODE, {
        method: "POST",
        body: JSON.stringify({
            job_id,
            sql_code
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function deleteData(
    ids : Array<string>,
    data_type : string, 
    token : string   
  ) {

    console.log("ids", ids)
    console.log("data_type", data_type)

    console.log("json string",  JSON.stringify({
      ids,
      data_type,
  }))

    try {
      const res = fetch(DELETE, {
        method: "POST",
        body: JSON.stringify({
            ids,
            data_type,
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

export async function getAwsDirs(token : string) {
    try {
      const res = await fetch(GET_AWS_DATA, {
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  // export async function getAllVariables() {
  //   try {
  //     const res = await fetch(GET_ALL_VARIABLES);
  //     return res;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  export async function getAllVariables(token : string) {
    try {
      let variables: IVariables[] = [];
      const res = await fetch(GET_ALL_VARIABLES, {
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        return variables;
      }
      const result = await res.json();
      if (result.error === true) {
        return result.message;
      }
      for (const item of result.message) {
        variables.push({ ...item, var_id : item._id});
      }
      return variables;
    } catch (error) {
      console.log("job fetch error: ", error);
    }
  }

  export async function getFinalHyperbatchCode(
    job_id : string,
    refined_sql_code : string ,
    token : string
  ) {
    try {
      const res = fetch(FINAL_SQL_CODE, {
        method: "POST",
        body: JSON.stringify({
            job_id,
            refined_sql_code
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

interface VarListItem {
    var: string;
    type: string;
    content: any;
}

  export async function createVariable(

    name : string,
    description : string,
    var_list : VarListItem[],
    date_created : string,
    token:string
  ) {
    try {
      const res = fetch(CREATE_VARIABLE, {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          var_list,
          date_created
        }),
        headers: {
          "Content-Type": "application/json",
          Cookies: `session_id=${token}`,
        },
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }