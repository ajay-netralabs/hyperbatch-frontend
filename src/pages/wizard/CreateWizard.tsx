import { EditorState, convertToRaw, ContentState } from "draft-js";
import { useState, ChangeEvent, useEffect } from "react";
import { InputText, TextArea, Button, Select } from "../../components/form";
import { TextEditor } from "../../components/index";

import "./wizard.css"
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, getBusinessLogic, getHyperbatchCode, getProgramSummary, getRefinedHyperbatchCode, getAllJobs ,getFinalHyperbatchCode, getAllVariables } from "../../services/ApiServices";
import { toast } from "react-toastify";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { downloadText } from "download.js";
import { addCurrentJob } from "../../store/slices/currentResources";
import { useNavigate } from "react-router-dom";
import { addJob, addOne, updateOne } from "../../store/slices/job.slice";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { addVariable } from "../../store/slices/variables.slice";

// import { EditorState } from 'draft-js';
import Cookies from 'universal-cookie';
export const CreateWizard = () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const open = useSelector((state:any) => state.sidebar.open)
    const allJobs = useSelector((state:any) => state.jobs.jobs)
    const selectedJobId = useSelector((state: any) => state.selectedResource.jobId)
    const selectedJob = allJobs.find((job:any) => job.job_id === selectedJobId)

    const allProjects = useSelector((state:any) => state.projects.projects)

    const allvariables = useSelector((state:any) => state.variables.variables)

    const [wizardDetails , setWizardDetails] = useState(() => {
        const currentDate = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: 'numeric' });
        if(selectedJob){
            return {
                name: selectedJob.name,
                description: selectedJob.description,
                project: selectedJob.project_id,
                jobId: selectedJob.job_id,
                businessResp: selectedJob.business_logic,
                programSummaryResp: selectedJob.program_summary,
                hyperBatchResp: selectedJob.sql_code,
                refinedHyperBatchResp: selectedJob.refined_sql_code,
                date_created : currentDate,
                project_name: selectedJob.project_name,
                finalCodeResp: selectedJob.final_code,
                variable: selectedJob.var_id || selectedJob.variable_id,
                variable_name: selectedJob.variable_name
            }

        }else{
            return {
                name : "",
                description : "",
                project : "",
                jobId : "",
                businessResp : "",
                programSummaryResp : "",
                hyperBatchResp : "",
                refinedHyperBatchResp : "",
                date_created : currentDate,
                project_name: "",
                finalCodeResp: "",
                variable: "",
                variable_name: ""
            }
        }
    })


    const [step, setStep] = useState(0)

    const [projects, setProjects]:any = useState([])
    const [loadingProjects, setLoadingProjects] = useState(false)
    const [loadingApiRequest, setLoadingApiRequest] = useState(false)

    const [loadingVariables, setLoadingVariables] = useState(false)

    const [businessLogic, setBusinessLogic] = useState(() => {
        if(selectedJob && selectedJob.business_logic){
            return EditorState.createWithContent(
                ContentState.createFromText(selectedJob.business_logic)
              );
        }else {
            return EditorState.createEmpty();
          }
    })
    const [programSummary, setProgramSummary] = useState(() => {
        if(selectedJob && selectedJob.program_summary){
            return EditorState.createWithContent(
                ContentState.createFromText(selectedJob.program_summary)
              );
        }else {
            return EditorState.createEmpty();
          }
    })
    // const [hyperbatchCode, setHyperbatchCode] = useState(() => {
    //     if(selectedJob && selectedJob.sql_code){
    //         return EditorState.createWithContent(
    //             ContentState.createFromText(selectedJob.sql_code)
    //           );
    //     }else {
    //         return EditorState.createEmpty();
    //       }
    // })

    const [hyperbatchCode, setHyperbatchCode] = useState(() => {
        if(selectedJob && selectedJob.sql_code){
            return selectedJob.sql_code
        }else {
            return ""
          }
    })

    // const [refinedHyperbatchCode, setRefinedHyperbatchCode] =  useState(() => {
    //     if(selectedJob && selectedJob.refined_sql_code){
    //         return EditorState.createWithContent(
    //             ContentState.createFromText(selectedJob.refined_sql_code)
    //           );
    //     }else {
    //         return EditorState.createEmpty();
    //       }
    // })

    const [refinedHyperbatchCode, setRefinedHyperbatchCode] =  useState(() => {
        if(selectedJob && selectedJob.refined_sql_code){
            return selectedJob.refined_sql_code
        }else {
            return ""
          }
    })

    const [finalCode, setFinalCode] = useState(() => {
        if(selectedJob && selectedJob.final_code){
            return selectedJob.final_code
        }else {
            return ""
        }
    })


    useEffect(() => {

        // if variables are empty, fetch
        const fetchAllVariables = async () => {
            setLoadingVariables(true)
            const variables = await getAllVariables(token)
            if(Array.isArray(variables)){
                dispatch(addVariable(variables))
            }
            setLoadingVariables(false)
        }

        if(!allvariables.length){
            fetchAllVariables()
        }
    }, [])

    useEffect(() => {
        // dispatch setProjects from here
        const getProjects = async () => {
            setLoadingProjects(true)
            const projects = await getAllProjects(token)
            setProjects(projects)
            setLoadingProjects(false)
        }

        if(allProjects.length){
            setProjects(allProjects)
        }else{
            getProjects()
        }
        // get projects on load

        if(selectedJob){
            setStep(1)
        }

        return ():void => {
            dispatch(addCurrentJob(""))
        }
    }, [])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const AllJobs = await getAllJobs(token); 
    
                if (Array.isArray(AllJobs)) {
                    dispatch(addJob(AllJobs));
                }
            } catch (error) {
            }
        };

        if(!allJobs.length) fetchProjects()
    }, [])


    const getProjectOptions = (projects:any) => {
        const res:any = []

        // if(selectedJob){
        //     const usedProject = allProjects.find((project:any) => project._id === wizardDetails.project)
        //     res.push({
        //         label: usedProject.name,
        //         value: usedProject._id
        //     })

        // }else{
            projects?.forEach((project: any) => {
                res.push({
                    label: project.name,
                    value: project._id || project.project_id
                })
            })
        // }


        return res
    }

    const getVariableOptions = () => {
        const res:any = []

        allvariables?.forEach((variable:any) => {
            res.push({
                label: variable.name,
                value: variable._id
            })
        })
        return res
    }

    const onValueChange = (name: string, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        if(name === "project"){
            // when selecting project, store the project name to display in jobs home page
            const projectName = projects.find((project:any) => project._id === value || project.project_id === value)?.name
            setWizardDetails((state:any) => {
                return {
                    ...state,
                    [name] : value,
                    project_name : projectName
                }
            })
        }else if(name === "variable"){
            const variableName = allvariables.find((variable:any) => variable._id === value)?.name
            setWizardDetails((state:any) => {
                return {
                    ...state,
                    [name] : value,
                    variable_name : variableName
                }
            })

        } else{
            setWizardDetails(state=> ({
                ...state,
                [name] : value
            }))
        }
    }


    // const updateEditorState = () => {
    //     const newState = Modifier.insertText(
    //         businessLogicEditor.getCurrentContent(), // get ContentState from EditorState
    //         businessLogicEditor.getSelection(),
    //         "testing"
    //       );
    //     setBusinessLogic(EditorState.createWithContent(newState))
    // }

    // const handleStateChange = (e : EditorState) => {
    //     setBusinessLogic(e)
    // }

    // get business logic
    // program summary
    // hyperbatch
    // refined hyperbatch

    const getTextFormat = (state:any) => {
        const contentState = state.getCurrentContent()
        const rawContent = convertToRaw(contentState).blocks

        let texts = ""

        rawContent.forEach((block:any) => {
            texts += block.text + "\n"
        })

        return texts
    }


    const getEditorData = (state:any) => {
        const contentState = state.getCurrentContent()
        const rawContent = convertToRaw(contentState).blocks

        let texts = ""

        rawContent.forEach((block:any) => {
            texts += block.text
        })

        return texts
    } 

    const convertToEditorData = (data:any) => {
        const newState = ContentState.createFromText(data)
        return EditorState.createWithContent(newState)
    }

    useEffect(() => {
        const handleChangeStep = async() => {
            switch(step){
                case 1 : {
                    const { name, description, project, date_created, variable } = wizardDetails

                    if(!name){
                        toast("Please enter a job name")
                        setStep(0)
                        return
                    }

                    if(!description){
                        toast("Please enter job description")
                        setStep(0)
                        return
                    }

                    if(!project){
                        toast("Please select a project")
                        setStep(0)
                        return
                    }


                    // check if business logic is already present and has not changed
                    const texts = getEditorData(businessLogic)
                    const editorTexts = getEditorData(convertToEditorData(wizardDetails.businessResp))
                    // const editorTexts = wizardDetails.businessResp

                    if(texts && editorTexts && texts === editorTexts){
                        return
                    }

                    setLoadingApiRequest(true)
                    const resp = await getBusinessLogic(project,name,description, date_created, variable, token)
                    const jsonResp = await resp?.json()

                    if(jsonResp.error){
                        toast(jsonResp.message)
                        setStep(0)
                        setLoadingApiRequest(false)
                        return
                    }else{
                        const newState = ContentState.createFromText(jsonResp.message)
                        setBusinessLogic(EditorState.createWithContent(newState))
                        setLoadingApiRequest(false)
                        setWizardDetails(state => {
                            return {
                                ...state,
                                jobId: jsonResp.id,
                                businessResp : jsonResp.message
                                // businessResp: getEditorData(businessLogic)
                            }
                        })

                        // add job data to redux store
                        dispatch(addOne({ 
                            job_id : jsonResp.id, 
                            name: wizardDetails.name, 
                            description: wizardDetails.description, 
                            project_id: wizardDetails.project,
                            date_created: wizardDetails.date_created,
                            business_logic: jsonResp.message,
                            project_name: wizardDetails.project_name,
                            variable_id: wizardDetails.variable,
                            variable_name: wizardDetails.variable_name
                        }))
                    }

                    break;
                }

                case 2 : {
                    const oldText = getEditorData(businessLogic)
                    const editorTexts = getEditorData(convertToEditorData(wizardDetails.businessResp))
                    // const editorTexts = wizardDetails.businessResp

                    // if previous step data has not changed and current data is present, don't fetch
                    const currentStepData = getEditorData(programSummary)
                    
                    if(currentStepData && oldText && editorTexts && oldText === editorTexts){
                        break;
                    }
                    
                    setLoadingApiRequest(true)
                    const texts = getTextFormat(businessLogic)
                    const resp = await getProgramSummary(wizardDetails.jobId, texts, token)
                    const jsonResp = await resp?.json()

                    // need to update businessLogic state with state data
                    if(jsonResp.error){
                        toast(jsonResp.message)
                        setStep(1)
                        setLoadingApiRequest(false)
                        return
                    }else {
                        const newState = ContentState.createFromText(jsonResp.message)
                        setProgramSummary(EditorState.createWithContent(newState))
                        setLoadingApiRequest(false)
                        setWizardDetails((state:any) => {
                            return {
                                ...state,
                                businessResp: texts,
                                programSummaryResp : jsonResp.message
                                // programSummaryResp : getEditorData(programSummary)
                            }
                        })
                        // update job data in redux store
                        dispatch(updateOne({job_id : wizardDetails.jobId, program_summary : jsonResp.message}))
                    }

                    break;

                }

                case 3 : {
                    const oldText = getEditorData(programSummary)
                    const editorTexts = getEditorData(convertToEditorData(wizardDetails.programSummaryResp))
                    // const editorTexts = wizardDetails.programSummaryResp                    
                    // if previous step data has not changed and current data is present, don't fetch
                    // const currentStepData = getEditorData(hyperbatchCode)
                    const currentStepData = wizardDetails.hyperBatchResp

                    
                    if(currentStepData && oldText && editorTexts && oldText === editorTexts){
                        return
                    }
                    
                    setLoadingApiRequest(true)
                    const texts = getTextFormat(programSummary)
                    const resp = await getHyperbatchCode(wizardDetails.jobId, texts, token)
                    const jsonResp = await resp?.json()

                    // need to update businessLogic state with state data
                    if(jsonResp.error){
                        toast(jsonResp.message)
                        setStep(2)
                        setLoadingApiRequest(false)
                        return
                    }else {
                        // const newState = ContentState.createFromText(jsonResp.message)
                        // setHyperbatchCode(EditorState.createWithContent(newState))
                        setHyperbatchCode(jsonResp.message)
                        setLoadingApiRequest(false)
                        setWizardDetails((state:any) => {
                            return {
                                ...state,
                                programSummaryResp: texts,
                                hyperBatchResp : jsonResp.message
                                // hyperBatchResp : getEditorData(hyperbatchCode)
                            }
                        })

                        // update job data in redux store
                        dispatch(updateOne({job_id : wizardDetails.jobId, sql_code : jsonResp.message}))
                    }

                    break;
                }

                case 4 : {
                    // prev step data
                    const oldTexts = wizardDetails.hyperBatchResp
                    const editorTexts = hyperbatchCode

                    // if previous step data has not changed and current data is present, don't fetch
                    const currentStepData = refinedHyperbatchCode

                    if(currentStepData && oldTexts && editorTexts && oldTexts === editorTexts){
                        return
                    }
                    
                    setLoadingApiRequest(true)
                    // const texts = getTextFormat(hyperbatchCode)
                    const resp = await getRefinedHyperbatchCode(wizardDetails.jobId,  hyperbatchCode, token) /*texts)*/
                    const jsonResp = await resp?.json()

                    // need to update businessLogic state with state data
                    if(jsonResp.error){
                        toast(jsonResp.message)
                        setStep(3)
                        setLoadingApiRequest(false)
                        return
                    }else {
                        // const newState = ContentState.createFromText(jsonResp.message)
                        // setRefinedHyperbatchCode(EditorState.createWithContent(newState))
                        const { message } = jsonResp
                        setRefinedHyperbatchCode(message)
                        setLoadingApiRequest(false)

                        // also updating prev step data, that might have changed
                        setWizardDetails((state:any) => {
                            return {
                                ...state,
                                hyperBatchResp: hyperbatchCode,
                                refinedHyperBatchResp : message
                            }
                        })

                        // update job data in redux store
                        dispatch(updateOne({job_id : wizardDetails.jobId, refined_sql_code : message}))
                    }

                    break;
                }

                case 5 : {
                    // check if there is any change in previous refined code and refined code editor
                    const oldTexts = wizardDetails.refinedHyperBatchResp
                    const editorTexts = refinedHyperbatchCode

                    const currentStepData = finalCode

                    if(currentStepData && oldTexts && editorTexts && oldTexts === editorTexts){
                        return
                    }

                    // fetch final code 
                    //  UNCOMMENT THIS
                    setLoadingApiRequest(true)
                    const resp = await getFinalHyperbatchCode(wizardDetails.jobId, editorTexts, token)
                    const jsonResp = await resp?.json()

                    if(jsonResp.error){
                        toast(jsonResp.message)
                        setStep(3)
                        setLoadingApiRequest(false)
                        return
                    }else{
                        // update state
                        const { message } = jsonResp
                        setFinalCode(message)
                        setLoadingApiRequest(false)
                        setWizardDetails((state:any) => {
                            return {
                                ...state,
                                refinedHyperBatchResp : editorTexts,
                                finalCodeResp: message
                                // refinedHyperBatchResp : getEditorData(refinedHyperbatchCode)
                            }
                        })

                         // update job data in redux store
                         dispatch(updateOne({job_id : wizardDetails.jobId, final_code : message}))
                    }
                    break; 

                }
            }
        }

        handleChangeStep()

    }, [step])

    const downloadFile = () => {
        let contnentState:any
        let rawContentState:any
        let fileName = ""
        let texts = ""

        switch(step){
            case 1 : {
                contnentState = businessLogic.getCurrentContent()
                rawContentState = convertToRaw(contnentState).blocks
                fileName = "business_logic.txt"
                break;
            }
            case 2 : {
                contnentState = programSummary.getCurrentContent()
                rawContentState = convertToRaw(contnentState).blocks
                fileName = "program_summary.txt"
                break;
            }
            case 3 : {
                // step 3,4,5 doesn't use draft text editor, pass the states directly
                fileName = "hyperbatch_code.txt"
                texts = hyperbatchCode
                break;
            }
            case 4 : {
               
                fileName = "refined_hyperbatch_code.txt"
                texts = refinedHyperbatchCode
                break;
            }
            case 5 : {
                
                fileName = "final.txt"
                texts = finalCode
                break;
            }
        }

        if(rawContentState){
            rawContentState.forEach((block:any) => {
                texts += block.text + "\n\n";
            })
        }

        downloadText(fileName, texts)
    }

    // const getBlockTexts = (contentState:any) => {
    //     let texts = ""

    //     contentState.forEach((block:any) => {
    //         texts += block.text + "\n\n";
    //     })

    //     return texts
    // }


   const incrementStep = () => {
    setStep(step => step + 1)
   }

   const decrementStep = () => {
    setStep(step => step - 1)
   }



    const getWizardComponent = (step:number) => {
        if(step === 0){
            return (
                <div className="h-[40vh] flex justify-around items-center">
                    Click on next to start
                </div>
            )
        }

        if(step === 1) {
            return <TextEditor editorState={businessLogic}  setEditorState={setBusinessLogic} styleClasses="h-[40vh]"/>

        }

        if(step === 2) {
            return <TextEditor editorState={programSummary} setEditorState={setProgramSummary} styleClasses="h-[40vh]"/>

        }
        
        if(step === 3) {
            // return <TextEditor editorState={hyperbatchCode} setEditorState={setHyperbatchCode} styleClasses="h-[40vh]"/>
            return <CodeEditor value={wizardDetails.hyperBatchResp} onChange={(e) => setHyperbatchCode(e.target.value)}  language="python" padding={15}
                    style={{
                        overflowY: "scroll",
                        height: "40vh",
                        backgroundColor: "black",
                        borderRadius: "0px",
                        fontFamily:
                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />

        }

        if(step === 4) {
            // return <TextEditor editorState={refinedHyperbatchCode} setEditorState={setRefinedHyperbatchCode} styleClasses="h-[40vh]"/>
            return <CodeEditor value={wizardDetails.refinedHyperBatchResp} onChange={(e) => setRefinedHyperbatchCode(e.target.value)}  language="python" padding={15}
                    style={{
                        overflowY: "scroll",
                        height: "40vh",
                        backgroundColor: "black",
                        borderRadius: "0px",
                        fontFamily:
                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />
        }

        if(step === 5) {
            // return <TextEditor editorState={refinedHyperbatchCode} setEditorState={setRefinedHyperbatchCode} styleClasses="h-[40vh]"/>
            return <CodeEditor value={wizardDetails.finalCodeResp} onChange={(e) => setFinalCode(e.target.value)}  language="python" padding={15}
                    style={{
                        overflowY: "scroll",
                        height: "40vh",
                        backgroundColor: "black",
                        borderRadius: "0px",
                        fontFamily:
                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />
        }
}


    return (
        <div className="">
        <div className={`card-container ${open ? "sidenav-open" : ""}`}>
        <div className="info-wizard-container">
            <div className="basic-info mx-auto mt-4 flex flex-col gap-4">
            <p className="font-semibold">Create Job</p>
                <div className="job-info flex flex-col gap-4">
                    <InputText styleClass="input-sm" placeholder="Enter job name" value={wizardDetails.name} changeFn={(e:any) => onValueChange("name", e)} />
                    <TextArea styleClass="textarea-sm" placeholder="Job description" value={wizardDetails.description} changeFn={(e:any) => onValueChange("description", e)} />
                    
                    <div className="flex">
                        <div className="w-[50%] flex items-center">
                            <Select disabled={loadingProjects} value={wizardDetails.project || null} options={getProjectOptions(projects)} placeholder="Select a project" changeFn={(e:any) => onValueChange("project", e)}/>
                            {loadingProjects ? (
                                <div className="ml-2">
                                    <AiOutlineLoading3Quarters color="#036ca1" className="animate-spin"/>
                                </div>
                            ) : ""}

                        </div>

                        <div className="w-[50%] ml-5 flex items-center">
                            <Select disabled={loadingVariables} value={wizardDetails.variable || null} options={getVariableOptions()} placeholder="Select variable" changeFn={(e:any) => onValueChange("variable", e)}/>
                            {loadingVariables ? (
                                <div className="ml-2">
                                    <AiOutlineLoading3Quarters color="#036ca1" className="animate-spin"/>
                                </div>
                            ) : ""}

                        </div>

                    </div>

                </div>
                <div className="wizard-conatiner">
                    <ul className="steps w-full mx-auto">
                        <li className={`step text-xs ${step > 0 ? "step-primary" : ""}`}>Step 1</li>
                        <li className={`step text-xs ${step > 1 ? "step-primary" : ""}`}>Step 2</li>
                        <li className={`step text-xs ${step > 2 ? "step-primary" : ""}`}>Step 3</li>
                        <li className={`step text-xs ${step > 3 ? "step-primary" : ""}`}>Step 4</li>
                        <li className={`step text-xs ${step > 4 ? "step-primary" : ""}`}>Step 5</li>
                    </ul>
                  
                    {loadingApiRequest ? (
                        <div className="h-[40vh] mt-2 flex justify-around items-center">
                            <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                        </div>
                    ) :  (
                        <div className="border bg-base-100 mt-2">
                            {getWizardComponent(step)}
                        </div>
                        )}    


                    <div className="flex justify-between mt-3">
                        {step >= 2 ? (
                            <Button variant="primary" size="sm" styleClasses={`ml-2 !text-xs ${loadingApiRequest || loadingProjects ? "btn-disabled" : ""}`} clickFn={decrementStep}>Previous</Button>
                        ) : <div></div>}
                        <div>
                            {step >= 1 ? (
                                <Button variant="primary" size="sm" styleClasses={`ml-2 !text-xs ${loadingApiRequest || loadingProjects ? "btn-disabled" : ""}`} clickFn={downloadFile}>Download</Button>

                            ) : null}

                            {step <= 4 ? (
                                <Button variant="primary" size="sm" styleClasses={`ml-2 !text-xs ${loadingApiRequest || loadingProjects ? "btn-disabled" : ""}`} clickFn={incrementStep}>Next</Button>
                            ) : null}

                            {step === 5 ? (
                                <Button variant="primary" size="sm" styleClasses={`ml-2 !text-xs ${loadingApiRequest || loadingProjects ? "btn-disabled" : ""}`} clickFn={() => navigate("/jobs")}>Save</Button>
                            ) : null}
                            


                        </div>
                    </div>
                </div>
            </div>
        </div>


        </div>


            {/* <div className="w-full">
                <div role="tablist" className="tabs tabs-lifted">
                    <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 1" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 1</div>

                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2" checked />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 2</div>

                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 3</div>
                </div>
            </div> */}

        </div>
    )
}