import { useDispatch, useSelector } from "react-redux"
import { InputText, Select, TextArea, Button } from "../../components/form"
import { useState } from "react"
import { IoMdRefresh } from "react-icons/io";
import { createVariable, getAwsDirs } from "../../services/ApiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Cookies from 'universal-cookie';
import { addOne } from "../../store/slices/variables.slice";

export const CreateVariable = () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const open = useSelector((state:any) => state.sidebar.open)

    const [variableData, setVariableData] = useState(() => {
        const currentDate = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: 'numeric' });
        return {
            name : "",
            description : "",
            variables : [
                { name:"Cobol Rule" , var: "business_rule", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""}, /* aws - filepath, upload -  */
                { name:"Hyperbatch Rules" , var: "hyperbatch_code_rule", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""},
                { name:"Program summary example" , var: "program_summary_example", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""},
                { name:"Code correction instructions" , var: "Code_correction_instructions", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""},
                { name:"Incorrect sql code example" , var: "Incorrect_sql_code_example", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""},
                { name:"Corrected sql code example" , var: "Corrected_sql_code_example", type: "", content: "" , folder: "", file: "", fileName:"", fileByte: ""} 
            ],
            date_created: currentDate
        }
    })

    const [awsLoading, setAwsLoading] = useState(false)
    const [awsDir, setAwsDir]:any = useState({})

    const [loading, setLoading] = useState(false)

    const handleInputChange = (e: any, name: string) => {
        const { value } = e.target
        setVariableData((state: any) => {
            return {
                ...state,
                [name]: value
            }
        })
    }

    const handleVariableChange = (e:any, varName: string) => {
        const { value } = e.target

        setVariableData((state:any) => {
            return {
                ...state,
                variables : state.variables.map((variable:any) => {
                    if(variable.var === varName){
                        return {
                            ...variable,
                            type : value
                        }
                    }else return variable
                })
            }
        })
    }

    const fetchAwsDir = async() => {
        setAwsLoading(true)
        const data:any = await getAwsDirs(token)
 
        const jsonResp = await data.json()
 
        if(jsonResp.error) {
         setAwsDir([])
         toast(jsonResp.message)
         setAwsLoading(false)
         return
        }else{
         setAwsDir(jsonResp.message)
         setAwsLoading(false)
        }
    }

    const variableOptions = [{ label: "AWS", value: "aws"}, { label: "Upload", value : "upload"}]


    const getFileCount = (aws:any) => {
        const res:any = []

        Object.keys(aws)?.forEach((folder: string) => {
            const obj:any = {}
            obj.value = folder
            obj.label = `${folder} (${awsDir[folder].length})`

            res.push(obj)
        })


        return res
    }

    const getFileName = (folder:string) => {
        const res:any =[]

        // if(selectedProject && !Object.keys(awsDir).length){
        //     res.push({
        //         label : projectData.file,
        //         value : projectData.file
        //     })
        // }else{
        //     const files = awsDir[folder]
        //     files?.forEach((file:string) => {
        //         res.push({
        //             label : file,
        //             value : file
        //         })
        //     })
        // }

        const files = awsDir[folder]
        files?.forEach((file:string) => {
            res.push({
                label : file,
                value : file
            })
        })

        return res
    }

    const handleFilePath = (e:any, name:string, varName: string) => {
        const value = e.target.value

        // if folder is selected, update file also
        setVariableData((state: any) => {
            return {
                ...state,
                variables : state.variables.map((variable:any) => {
                    if(variable.var === varName){
                        return {
                            ...variable,
                            [name] : value,
                            file : name === "folder" ? getFileName(value)[0]?.value : value
                        }
                    }else return variable
                })
            }
        })

        // if(name === "folder"){
        //    const firstFile = getFileName(value)[0]
        //     setProjectData((state:any) => {
        //         return {
        //             ...state,
        //             file : firstFile?.value
        //         }
        //     })
        //     setSelectedFolder(value)
        // }


        // setProjectData((state:any) => {
        //         return {
        //             ...state,
        //             [name]:value
        //         }
        // })   
    }

    const toBase64 = (file:any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleFileUpload = async (e:any, varName:string) => {
        const file = e.target.files[0]

        const base64Data:any = await toBase64(file)

        const result = base64Data?.split(";base64,")[1]
        
        if(!result){
            toast("Select a valid file")
            return
        }

        setVariableData((state:any) => {
            return {
                ...state,
                variables: state.variables.map((variable:any) => {
                    if(variable.var === varName){
                        return {
                            ...variable,
                            fileName : file.name,
                            fileByte : result
                        }
                    }else return variable
                })
            }
        })

    }


    const handleCreateVariable = async() => {
        // fix data before calling the api

        if(!variableData.name){
            toast("Variable name is required")
            return
        }

        if(!variableData.description){
            toast("Variable description is required")
            return
        }

        const data = []
        
        // check each variable data

        // variableData.variables.forEach((variable:any) => {
        //     if (variable)
        // })

        for(let varData of variableData.variables){

            // return when type is not selected
           if(!varData.type){
                toast(`Select variable type for ${varData.name}`)
                return
           }

            if(varData.type === "upload") {
                if(!varData.fileByte){
                    toast(`Select a file for ${varData.name}`)
                    return
                }

                data.push({
                   var: varData.var,
                   type: varData.type,
                   content: varData.fileByte
                })
           }

           if(varData.type === "aws") {
                if(!varData.folder){
                    toast(`Select a aws folder for ${varData.name}`)
                    return
                }

                if(!varData.file){
                    toast(`Select a aws file for ${varData.name}`)
                    return
                }

                data.push({
                    var: varData.var,
                    type: varData.type,
                    content: `${varData.folder}/${varData.file}`
                })
           }
        }

        const { name, description, date_created} = variableData

        try{
            setLoading(true)
            const resp = await createVariable(name, description, data, date_created, token)
            const jsonResp = await resp?.json()

            if(jsonResp.error){
                toast(jsonResp.message)
                setLoading(false)
                return
            }else{
                // add to redux
                setLoading(false)
                dispatch(addOne({_id: jsonResp.message, name, description, date_created}))
                navigate("/variables")
            }

        }catch(err){

        }
    }



    return (
        <div className={`project-container flex justify-center ${open ? "sidenav-open" : ""}`}>
        {!loading ? (
            <div className="w-full">
                        <p className="font-semibold">Create Variable</p>
                        <div className="w-full flex flex-col gap-2">
                            <InputText  placeholder="Enter variable name" styleClass="mt-4 input-sm" value={variableData.name} changeFn={(e:any) => {handleInputChange(e, "name")}} />
                            <TextArea placeholder="Variable description" styleClass="mt-4 textarea-sm" value={variableData.description} changeFn={(e:any) => {handleInputChange(e, "description")}} />
                            <div className="mt-5">
                                <p className="font-semibold">Variables</p>
                                {variableData.variables.map((varData: any, i:number) => (
                                    <div className="flex items-center mt-4" key={i}>
                                        <p className="w-[20%] text-xs">{varData.name}</p>
                                        <Select styleClass="!w-[40%]" placeholder="Select variable type" options={variableOptions} changeFn={(e:any) => handleVariableChange(e, varData.var)}/>
                                        {varData.type === "aws" ? (
                                            <div className="aws-container flex justify-evenly items-center w-[40%]">
                                                <Select styleClass="!w-[40%]" placeholder="Select Folder" value={varData.folder} options={getFileCount(awsDir)} changeFn={(e:any) => handleFilePath(e, "folder", varData.var) }/>
                                                <Select styleClass="!w-[40%]" placeholder="Select File" value={varData.file} options={getFileName(varData.folder)} changeFn={(e:any) => handleFilePath(e,"file", varData.var)}/>
                                            
                                                <Button variant="primary" size="sm" styleClasses="!h-fit" clickFn={fetchAwsDir}>
                                                    <div className={`${awsLoading ? "animate-spin" : ""}`}>
                                                        <IoMdRefresh color="white"/>
                                                    </div>
                                                </Button>

                                            </div>
                                        ): null}

                                        {varData.type === "upload" ? (
                                            <div className="upload-container flex justify-evenly items-center w-[40%]">
                                                <input style={{margin: "0 4%"}} type="file" accept="txt" className="file-input file-input-sm file-input-primary file-input-bordered w-full" onChange={(e:any) => handleFileUpload(e, varData.var)} />
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                            <div className="w-[30%] flex mt-3 items-center">
                                <Button variant="primary" size="sm" styleClasses={` !text-xs ${loading ? "btn-disabled" : ""}`} clickFn={handleCreateVariable}>Create</Button>
                                {/* {loading ?  <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin ml-4"/> : null} */}
                            {/* {selectedProject ? (<Button variant="primary" size="md"  styleClasses={`ml-2 ${loading ? "btn-disabled" : ""}`} clickFn={handleUpdateProject}>Update Project</Button>): (<Button variant="primary" size="md" styleClasses={`ml-2 ${loading ? "btn-disabled" : ""}`} clickFn={handleCreateProject}>Create Project</Button>)} */}
                            </div>
                        </div>
            </div>
        ) : (
            <div className="flex justify-center items-center">
                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
            </div>
        )}
    </div>
    )
}