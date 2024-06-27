
// use url with job id
// that way, even we refresh will have the job id



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams  } from "react-router-dom";

import { TextEditor } from "../../components";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Button, InputText } from "../../components/form";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';
import { saveCode,getBusinessLogic, getFinalHyperbatchCode, getHyperbatchCode, getProgramSummary, getRefinedHyperbatchCode, autoFix, selfAssessment } from "../../services/ApiServices";
import { addOne, updateOne } from "../../store/slices/job.slice";
import CodeEditor from "@uiw/react-textarea-code-editor";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { downloadText } from "download.js";

import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

export const RunJob = () => {

    const [opened, modalFunctions ] = useDisclosure(false);

    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const open = useSelector((state: any) => state.sidebar.open);

    const { id } = useParams()
    const allJobs = useSelector((state:any) => state.jobs.jobs)

    // states
    const [currentJob, setCurrentJob] = useState<any>(() => {
        const job = allJobs.find((jobData:any) => jobData.job_id === id || jobData._id === id)
        return job ? job : {} 
    })
    const [step, setStep] = useState<number>(() => {
        if(currentJob.job_id){
            return 1
        }else return 0
    })

    const [loadingPage, setLoadingPage] = useState(false)

    const [loadingApiRequest, setLoadingApiRequest] = useState(false)


    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    console.log("id", id)

    // useEffect(() => {
    //     // check if job exists, if not
    //     // return to jobs
    //     const job = allJobs.find((jobData:any) => jobData._id === id)

    //     if(job){
    //         setCurrentJob(job)
    //     }else{
    //         navigate("/jobs")
    //     }
    // }, [id])


    const [businessLogic, setBusinessLogic] = useState(() => {
        console.log("inside business", currentJob)
        if(currentJob && currentJob.business_logic){
            return EditorState.createWithContent(
                ContentState.createFromText(currentJob.business_logic)
              );
        }else {
            return EditorState.createEmpty();
          }
    })

    const [programSummary, setProgramSummary] = useState(() => {
        if(currentJob && currentJob.program_summary){
            return EditorState.createWithContent(
                ContentState.createFromText(currentJob.program_summary)
              );
        }else {
            return EditorState.createEmpty();
          }
    })

    const [hyperbatchCode, setHyperbatchCode] = useState(() => {
        if(currentJob && currentJob.sql_code){
            return currentJob.sql_code
        }else {
            return ""
          }
    })

    const [refinedHyperbatchCode, setRefinedHyperbatchCode] =  useState(() => {
        if(currentJob && currentJob.refined_sql_code){
            return currentJob.refined_sql_code
        }else {
            return ""
          }
    })

    const [finalCode, setFinalCode] = useState(() => {
        if(currentJob && currentJob.final_sql_code){
            return currentJob.final_sql_code
        }else {
            return ""
        }
    })

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

    const getTextFormat = (state:any) => {
        const contentState = state.getCurrentContent()
        const rawContent = convertToRaw(contentState).blocks

        let texts = ""

        rawContent.forEach((block:any) => {
            texts += block.text + "\n"
        })

        return texts
    }

    useEffect(() => {
        const handleStepChange = async() => {
            switch(step){
                case 1 : {
                    // check if business logic is already present and has not changed
                    const texts = getEditorData(businessLogic)
                    const editorTexts = getEditorData(convertToEditorData(currentJob.business_logic || ""))
                    // const editorTexts = wizardDetails.businessResp

                    if(texts && editorTexts && texts === editorTexts){
                        return
                    }

                    const { job_id, project_id, name, description, date_created, variable} = currentJob
                    setLoadingApiRequest(true)
                    const resp = await getBusinessLogic(job_id, token)
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
                        setCurrentJob((state:any) => {
                            return {
                                ...state,
                                // jobId: jsonResp.id,
                                business_logic : jsonResp.message
                                // businessResp: getEditorData(businessLogic)
                            }
                        })

                        // add job data to redux store
                        dispatch(updateOne({ 
                            job_id, 
                            business_logic: jsonResp.message
                        }))
                    }

                    break;
                }

                case 2 : {
                    const oldText = getEditorData(businessLogic)
                    const editorTexts = getEditorData(convertToEditorData(currentJob.business_logic))
                    // const editorTexts = wizardDetails.businessResp

                    // if previous step data has not changed and current data is present, don't fetch
                    const currentStepData = getEditorData(programSummary)
                    
                    if(currentStepData && oldText && editorTexts && oldText === editorTexts){
                        break;
                    }
                    
                    setLoadingApiRequest(true)
                    const texts = getTextFormat(businessLogic)
                    const resp = await getProgramSummary(currentJob.job_id, texts, token)
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
                        setCurrentJob((state:any) => {
                            return {
                                ...state,
                                businessResp: texts,
                                program_summary : jsonResp.message
                                // programSummaryResp : getEditorData(programSummary)
                            }
                        })
                        // update job data in redux store
                        dispatch(updateOne({job_id : currentJob.job_id, program_summary : jsonResp.message}))
                    }

                    break;

                }

                case 3 : {
                    const oldText = getEditorData(programSummary)
                    const editorTexts = getEditorData(convertToEditorData(currentJob.program_summary))
                    // const editorTexts = wizardDetails.programSummaryResp                    
                    // if previous step data has not changed and current data is present, don't fetch
                    // const currentStepData = getEditorData(hyperbatchCode)
                    const currentStepData = currentJob.sql_code
                    
                    if(currentStepData && oldText && editorTexts && oldText === editorTexts){
                        return
                    }

                    setLoadingApiRequest(true)
                    const texts = getTextFormat(programSummary)
                    const resp = await getHyperbatchCode(currentJob.job_id, texts, token)
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
                        setCurrentJob((state:any) => {
                            return {
                                ...state,
                                // programSummaryResp: texts,
                                sql_code : jsonResp.message
                                // hyperBatchResp : getEditorData(hyperbatchCode)
                            }
                        })

                        // update job data in redux store
                        dispatch(updateOne({job_id : currentJob.job_id, sql_code : jsonResp.message}))
                    }

                    break;
                }

                case 4 : {
                    // prev step data
                    const oldTexts = currentJob.sql_code
                    const editorTexts = hyperbatchCode

                    // if previous step data has not changed and current data is present, don't fetch
                    const currentStepData = refinedHyperbatchCode

                    if(currentStepData && oldTexts && editorTexts && oldTexts === editorTexts){
                        return
                    }

                    setLoadingApiRequest(true)
                    // const texts = getTextFormat(hyperbatchCode)
                    const resp = await getRefinedHyperbatchCode(currentJob.job_id,  hyperbatchCode, token) /*texts)*/
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
                        setCurrentJob((state:any) => {
                            return {
                                ...state,
                                hyperBatchResp: hyperbatchCode,
                                refined_sql_code : message
                            }
                        })

                        // update job data in redux store
                        dispatch(updateOne({job_id : currentJob.job_id, refined_sql_code : message}))
                    }

                    break;
                }

                case 5 : {
                    // check if there is any change in previous refined code and refined code editor
                    const oldTexts = currentJob.refined_sql_code
                    const editorTexts = refinedHyperbatchCode

                    const currentStepData = finalCode

                    if(currentStepData && oldTexts && editorTexts && oldTexts === editorTexts){
                        return
                    }

                    // fetch final code 
                    //  UNCOMMENT THIS
                    setLoadingApiRequest(true)
                    const resp = await getFinalHyperbatchCode(currentJob.job_id, editorTexts, token)
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
                        setCurrentJob((state:any) => {
                            return {
                                ...state,
                                refinedHyperBatchResp : editorTexts,
                                final_sql_code: message
                                // refinedHyperBatchResp : getEditorData(refinedHyperbatchCode)
                            }
                        })

                         // update job data in redux store
                         dispatch(updateOne({job_id : currentJob.job_id, final_sql_code : message}))
                    }
                    break; 

                }
            }
        }

        handleStepChange()
        // console.log("effect", step)
    }, [step])


    const MAX_STEP = 6
    const MIN_STEP = 0

    const incrementStep = () => {
        const nextStep = step + 1
        if(nextStep <= MAX_STEP){
            setStep(nextStep)
        }
    }

    const decrementStep = () => {
        const prevStep = step - 1
        if(prevStep >= MIN_STEP){
            setStep(step => step - 1)
        }
    }

    const getCurrentEditor = (step:number) => {
        if(step === 0){
            return <div className="h-[40vh] flex justify-around items-center">&nbsp;</div>
        }

        if(step === 1){
            return <TextEditor editorState={businessLogic}  setEditorState={setBusinessLogic} styleClasses="h-[40vh]"/>
        }

        if(step === 2){
            return <TextEditor editorState={programSummary} setEditorState={setProgramSummary} styleClasses="h-[40vh]"/>
        }

        if(step === 3){
            return (
                <div className="h-[40vh] overflow-auto">
                    <CodeEditor value={currentJob.sql_code} onChange={(e) => setHyperbatchCode(e.target.value)}  language="sql" padding={15}
                        style={{
                            backgroundColor: "black",
                            borderRadius: "0px",
                            fontFamily:
                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />
                </div>
            )

        }

        if(step >= 4){
            return (
                <div className="h-[40vh] overflow-auto">
                    <CodeEditor value={currentJob.refined_sql_code} onChange={(e) => setRefinedHyperbatchCode(e.target.value)}  language="sql" padding={15}
                        style={{
                            backgroundColor: "black",
                            borderRadius: "0px",
                            fontFamily:
                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />
            </div>
            )
        }

        // if(step === 3){
        //     return <TextEditor editorState={programSummary} setEditorState={setProgramSummary} styleClasses="h-[40vh]"/>
        // }
                    
    }

    const getFinalOutputEditor = () => {
        if(step >= 5){
            return (
                <div className="h-[40vh] overflow-auto">
                    <CodeEditor value={currentJob.final_sql_code} onChange={(e) => setFinalCode(e.target.value)}  language="sql" padding={15}
                        style={{
                            backgroundColor: "black",
                            borderRadius: "0px",
                            fontFamily:
                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }} />
            </div>
            )
        }else{
            <div className="h-[40vh] flex justify-around items-center">&nbsp;</div>
        }
    }


    const getAutoFixEditor = () => {
        return (
            <div className="h-[40vh] overflow-auto">
                <CodeEditor value={finalCode} onChange={(e) => setFinalCode(e.target.value)}  language="sql" padding={15}
                style={{
                    backgroundColor: "black",
                    borderRadius: "0px",
                    fontFamily:
                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }} />
            </div>
        )
        
    }

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

    const handleSave = async () => {
        // save output to aws
        const { job_id} = currentJob

        try{
            setLoadingPage(true)
            const resp = await saveCode(finalCode, job_id, token)
            const jsonResp = await resp?.json()
    
            if(jsonResp.error){
                toast(jsonResp.message)
                setLoadingApiRequest(false)
                setLoadingPage(false)
                return
            }
            else{
                setLoadingApiRequest(false)
                dispatch(updateOne({job_id : currentJob.job_id, final_code : finalCode}))
                setLoadingPage(false)
                navigate("/jobs")
            }
        }catch{
            toast.error("Something went wrong")
            setLoadingPage(false)
        }

    }


    const [feedback, setFeedback] = useState<string>("")
    const [suggestion, setSuggestion] = useState(EditorState.createEmpty())

    const [loadingSuggestion, setLoadingSuggestion] = useState<boolean>(false)
    const [disableAutoFix, setDisableAutoFix] = useState<boolean>(false)

    const [loadingAutoFix, setLoadingAutoFix] = useState<boolean>(false)

    const handleAutoFix = async () => {
        try{

            setLoadingAutoFix(true)
            const texts = getTextFormat(suggestion)
            const res = await autoFix(finalCode, currentJob.job_id, feedback, texts, token)
            
            if(!res?.ok){
                toast.error(res?.statusText)
                setLoadingAutoFix(false)
                return;
            }

            const jsonResp = await res.json()

            if(jsonResp.error){
                toast.error(jsonResp.message)
                setLoadingAutoFix(false)
                return;
            }

            // if ok then what?
            setFinalCode(jsonResp.message)

            setCurrentJob((state:any) => {
                return {
                    ...state,
                    final_code: jsonResp.message
                }
            })
            dispatch(updateOne({job_id : currentJob.job_id, final_code : jsonResp.message}))
            setLoadingAutoFix(false)

        }catch{
            toast.error("Something went wrong")
        }
    }

    const handleSelfAssesment = async () => {
        try{
            setDisableAutoFix(false)
            setLoadingSuggestion(true)
            const res = await selfAssessment(finalCode, currentJob.job_id, token)

            if(!res?.ok){
                toast.error(res?.statusText)
                setLoadingSuggestion(false)
                return;
            }

            const jsonResp = await res.json()

            if(jsonResp.error){
                toast.error(jsonResp.message)
                setLoadingSuggestion(false)
                return;
            }

            setLoadingSuggestion(false)
            // setSuggestion(jsonResp.message)
            setSuggestion(EditorState.createWithContent(
                ContentState.createFromText(jsonResp.message)
              ))
            
            const NO_ISSUE_TEXT = "no problems found"
            if(jsonResp.message.includes(NO_ISSUE_TEXT)){
                setDisableAutoFix(true)
            }

            // disable autofix if suggetion returns no problems found 
            // if ok then what?


        }catch{
            toast.error("Something went wrong")
        }
    }



    return (
        <div className={`project-container ${open ? "sidenav-open" : ""}`}>
            {loadingPage ? (
                <div className="h-[40vh] mt-2 flex justify-around items-center">
                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                </div>
            ) : (
                
                <>
                    <div className="flex justify-center">
                            <h1 className="top-heading font-semibold">Run Job</h1>
                    </div>
                    <div className="job-info-container flex flex-col gap-2 mt-2">
                            {/* project name */}
                            <div className="project-name-container flex gap-2">
                                <p className="font-semibold text-sm">PROJECT :</p>
                                <p className="text-sm">{currentJob?.project_name}</p>
                            </div>

                            {/* job name */}
                            <div className="job-name-container flex gap-2">
                                <p className="font-semibold text-sm">JOB :</p>
                                <p className="text-sm">{currentJob?.name}</p>
                            </div>

                            {/* job description */}
                            <div className="job-desc-container flex gap-2">
                                <p className="font-semibold text-sm">DESCRIPTION :</p>
                                <p className="text-sm">{currentJob?.description}</p>
                            </div>
                    </div>

                    <div className="steps-container mt-5">
                            <ul className="steps w-full mx-auto">
                                <li className={`step text-xs ${step > 0 ? "step-primary" : ""}`}></li>
                                <li className={`step text-xs ${step > 1 ? "step-primary" : ""}`}></li>
                                <li className={`step text-xs ${step > 2 ? "step-primary" : ""}`}></li>
                                <li className={`step text-xs ${step > 3 ? "step-primary" : ""}`}></li>
                                <li className={`step text-xs ${step > 4 ? "step-primary" : ""}`}></li>
                                <li className={`step text-xs ${step > 5 ? "step-primary" : ""}`}></li>
                            </ul>
                        </div>
                        <>{console.log("step", step)}</>
                        {/* editors */}
                        <div className="editor-container flex justify-between gap-4 mt-5">
                            { step <= 5 ? (
                                <>
                                    <div className="w-[50%] border border-black bg-base-100 ">
                                        <div className="border-b border-black p-2">Input Files :</div>
                                        <div className="">
                                            {loadingApiRequest ? (
                                                    <div className="h-[40vh] mt-2 flex justify-around items-center">
                                                        <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                                                    </div>
                                                ) :  (
                                                    <>
                                                        {getCurrentEditor(step)}
                                                    </>
                                                    )}    
                                        </div>
                                    </div>

                                    <div className="w-[50%] border border-black bg-base-100">
                                        <div className="border-b border-black p-2">Expected Output Files :</div>
                                        <div className="">
                                            {step === 5 && loadingApiRequest ? (
                                                <div className="h-[40vh] mt-2 flex justify-around items-center">
                                                        <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                                                    </div>
                                            ): <>
                                                {getFinalOutputEditor()}
                                            </>}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-[70%] border border-black bg-base-100 ">
                                    <>{console.log("step", step)}</>
                                        <div className="border-b border-black p-2">HYPERBATCH CODE :</div>
                                        <div>
                                            {getFinalOutputEditor()}
                                        </div>
                                    </div>
                                    <div className="w-[30%] flex flex-col gap-2 ">
                                        <div className="border border-black bg-base-100">
                                            <div className="border-b border-black p-2">STATUS :</div>
                                                <div className="h-[40vh] flex flex-col justify-between">
                                                    <div className="flex flex-col justify-between gap-2">
                                                        {loadingSuggestion ? (
                                                            <div className="mt-4 flex justify-around items-center">
                                                                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                                                            </div>
                                                        ) : (
                                                            // <div className="p-2 overflow-y-scroll">ajay</div>
                                                            <TextEditor editorState={suggestion}  setEditorState={setSuggestion} editorStyle={{height: "calc(40vh - 90px)"}}/>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <Button size="sm" variant="accent" styleClasses={`rounded-none text-white ${loadingSuggestion || disableAutoFix ? "btn-disabled" : ""}`} clickFn={modalFunctions.open}>Accept Recommendations</Button>
                                                        <Button size="sm" variant="accent" styleClasses={`rounded-none text-white ${loadingSuggestion ? "btn-disabled" : ""}`} clickFn={handleSelfAssesment}>Suggest Fixes</Button>
                                                    </div>
                                                    </div>
                                             </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* history details */}
                        <div className="history-container h-[20vh] border border-black bg-base-100 mt-5">
                        <div className="border-b border-black p-2">
                                History :
                        </div>

                        <div className="history-table">
                                <div className="table-heading bg-base-100 text-black border-b border-black">
                                    <div style={{ width: "25%", padding: "5px 0" }} className="border-black border-r ml-2">Date</div>
                                    <div style={{ width: "25%", padding: "5px 0" }} className="border-black border-r ml-2">Time</div>
                                    <div style={{ width: "50%", padding: "5px 0" }} className="ml-2">Task</div>
                                </div>
                        </div>             
                        </div>

                        {/* buttons */}
                        <div className="mt-5 flex justify-between">
                            
                                <Button clickFn={decrementStep} styleClasses={`!text-xs btn-accent text-white !rounded-sm  ${loadingApiRequest || step === MIN_STEP + 1 ? "btn-disabled" : ""}`}>previous</Button> 

                            <div className="flex gap-2">
                            
                                <Button clickFn={downloadFile} styleClasses={`!text-xs btn-accent text-white !rounded-sm  ${loadingApiRequest ? "btn-disabled" : ""}`}>Download</Button>
                            
                            {step < MAX_STEP ? (
                                <Button clickFn={incrementStep} styleClasses={`!text-xs btn-accent text-white !rounded-sm  ${loadingApiRequest || step === MAX_STEP ? "btn-disabled" : ""}`}>{step === 0 ? "Run Job" : "Next"}</Button>

                            ) : (
                                <Button clickFn={() => {handleSave()}} styleClasses={`!text-xs btn-accent text-white !rounded-sm  ${loadingApiRequest ? "btn-disabled" : ""}`}>Save</Button>
                            )}
                            </div>
                        </div>
                </>
            )}


            <Modal opened={opened} onClose={modalFunctions.close} title="Suggest Fixes" centered size={"70%"}>
                <div className="flex flex-col gap-2">
                    <div>
                        {loadingAutoFix ? (
                            <div className="h-[40vh] mt-2 flex justify-around items-center">
                                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                            </div>
                        ) : <>{getAutoFixEditor()}</>}
                    </div>
                    
                    <TextEditor editorState={suggestion}  setEditorState={setSuggestion} styleClasses="h-[20vh]"/>
                    <InputText placeholder="Feedback" styleClass="input-sm" value={feedback} changeFn={(e:any) => setFeedback(e.target.value)} />
                   <div className="flex justify-end gap-2">
                        <Button size="sm" variant="accent" styleClasses={`text-white rounded-none ${loadingAutoFix ? "btn-disabled" : ""}`} clickFn={handleAutoFix}>Generate</Button>
                        <Button size="sm" variant="accent" styleClasses={`text-white rounded-none`} clickFn={modalFunctions.close}>Close</Button>
                   </div>
                </div>
            </Modal>

        </div>
    )
}