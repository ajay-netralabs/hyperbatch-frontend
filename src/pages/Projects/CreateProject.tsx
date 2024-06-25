import { useDispatch, useSelector } from "react-redux"
import "./project.css"

import { IoMdRefresh } from "react-icons/io";

import { useDisclosure } from '@mantine/hooks';
import { Checkbox, Modal } from '@mantine/core';

import { InputText, TextArea, Select, Button } from "../../components/form"
import { useEffect, useState } from "react";
import { getAwsDirs, createProject, updateProject, getAllProjects } from "../../services/ApiServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addCurrentProject } from "../../store/slices/currentResources";
import { addOne, addProject, updateOne } from "../../store/slices/project.slice";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toBase64 } from "../../services/utils";
import Cookies from 'universal-cookie';
import { addFetch } from "../../store/slices/fetchedResources";


export const CreateProject = () => {

    const [inputOpend, inputFilesFunctions ] = useDisclosure(false);
    const [outputOpened, outputFilesFunctions] = useDisclosure(false)
    

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const open = useSelector((state:any) => state.sidebar.open)

    const allProjects = useSelector((state:any) => state.projects.projects)
    const selectedProjectId = useSelector((state: any) => state.selectedResource.projectId)
    const selectedProject = allProjects.find((project:any) => project.project_id === selectedProjectId)

    const alreadyFetchedProjects = useSelector((state:any) => state.fetchedResources.projects)

    // const [forceFetch, setForceFetch] = useState(false)
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")

    const [projectData, setProjectData] = useState(() => {
        const currentDate = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: 'numeric' });
        if(selectedProject){
            // const path = selectedProject.filePath.split("/")

            const file_type = selectedProject.file_type
            const path = file_type === "aws" ?  selectedProject.file.split("/") : null

            return {
                name : selectedProject.name,
                description: selectedProject.description,
                folder: path ? path[0] : null,
                file: path ? path.length === 1 ? path[0] : path[1] : null,
                file_type: selectedProject.file_type,
                fileByte: !path ? selectedProject.file : "",
                date_created : currentDate,
                input_files : [{ file : path[1]}],
                output_files: []
            }

        }else{
            return {
                name : "",
                description : "",
                folder : "", // n
                file: "", // file content || filepath - n
                file_type : "", // n
                fileByte : "", // n
                date_created : currentDate,
                output_folder : "", // n
                output_file : "", // n
                input_files : [],
                output_files : []
            }
        }
    })

    // console.log("project data: ", projectData)

    const [loading, setLoding] = useState(false)

    const [awsDir, setAwsDir]:any = useState({})
    const [awsLoading, setAwsLoading] = useState(false)

    const [selectedFolder, setSelectedFolder] = useState("")



    const generateRandomID = () => crypto.randomUUID().toString().split("-")[0]

    const FILE_DATA = {
        folder: "",
        file: ""
    }

    const INITIAL_INPUT_FILE = {
        ...FILE_DATA,
        id: generateRandomID(),
    }

    const INITIAL_OUTPUT_FILE = {
        ...FILE_DATA,
        id: generateRandomID(),
    }

    const [inputFile, setInputFile] = useState<any>(INITIAL_INPUT_FILE)

    const [outputFile, setOutputFile] = useState<any>(INITIAL_OUTPUT_FILE)

    const [selectedInputFiles, setSelectedInputFiles] = useState<any[]>([])

    const [selectedOutputFiles, setSelectedOutputFiles] = useState<any[]>([])


    const handleSelectInputFile = (check:boolean, id:string) => {
        if(check){
            setSelectedInputFiles((state:any) => ([...state, id]))
        }else{
            setSelectedInputFiles((state:any) => state.filter((selectedId:string) => selectedId !== id))
        }
    }

    // console.log("selected input files", selectedInputFiles)

    const handleSelectOutputFile = (check:boolean, id:string) => {
        if(check){
            setSelectedOutputFiles((state:any) => ([...state, id]))
        }else{
            setSelectedOutputFiles((state:any) => state.filter((selectedId:string) => selectedId !== id))
        }
    }   


    const handleDeleteFile = (type:string) => {
        // delete selected files
        if(type === "input") {
            setProjectData((state:any) => {
                return {
                    ...state,
                    input_files : state.input_files.filter((inputData:any) => !selectedInputFiles.includes(inputData.id))
                }
            })
        }

        if(type === "output") {
            setProjectData((state:any) => {
                return {
                    ...state,
                    output_files : state.output_files.filter((outputData:any) => !selectedInputFiles.includes(outputData.id))
                }
            })
        }

        // TODO: [call update project api with project Data]
    }

    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         try {
    //             const AllProjects = await getAllProjects(token); 
    //             if (Array.isArray(AllProjects)) {
    //                 // const projectsWithoutFilePath = AllProjects.map(project => ({
    //                 //     ...project,
    //                 //     filePath: project.filePath ? project.filePath.split('/').pop() : '',
    //                 // }));
    //                 //@ts-ignore
    //                 dispatch(addProject(AllProjects));
    //                 dispatch(addFetch("projects"))
    //             } 
    //         } catch (error) {
               
    //         }
    //     };

    //     if(!allProjects.length && !alreadyFetchedProjects){
    //         fetchProjects()
    //     }
    // },[])

    useEffect(() => {
        return () => {
            dispatch(addCurrentProject(""))
        }
    }, [dispatch]);

    const handleInputChange = (e:any, name:string) => {
        const value = e.target.value

        setProjectData((state:any) => {
            if(name === "file_type"){
                return {
                    ...state,
                    [name] : value,
                    folder : null,
                    file : null,
                    fileByte : ""
                }
            }else{
                return {
                    ...state,
                    [name] : value
                }
            }
        })
    }

    const handleFilePath = (e:any, name:string) => {
        const value = e.target.value

        if(name === "folder"){
           const firstFile = getFileName(value)[0]
            setProjectData((state:any) => {
                return {
                    ...state,
                    file : firstFile?.value
                }
            })
            setSelectedFolder(value)
        }


        setProjectData((state:any) => {
                return {
                    ...state,
                    [name]:value
                }
        })   
    }

    const getFileCount = (aws:any) => {
        const res:any = []

        if(selectedProject && !Object.keys(aws).length){
            res.push({
                value : projectData.folder,
                label : projectData.folder
            })
        }else{
            Object.keys(aws)?.forEach((folder: string) => {
                const obj:any = {}
                obj.value = folder
                obj.label = `${folder} (${awsDir[folder].length})`
    
                res.push(obj)
            })
        }


        return res
    }

    const getFileName = (folder:string) => {
        const res:any =[]

        if(selectedProject && !Object.keys(awsDir).length){
            res.push({
                label : projectData.file,
                value : projectData.file
            })
        }else{
            const files = awsDir[folder]
            files?.forEach((file:string) => {
                res.push({
                    label : file,
                    value : file
                })
            })
        }

        return res
    }

    const fetchAwsDir = async () => {
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


    const handleCreateProject = async () => {

      const { name, description, date_created, input_files, output_files } = projectData

      if(!name){
        toast("Please enter project name")
        return
      }

      if(!description){
        toast("Please enter project description")
        return
      }

    //   if(!file_type){
    //     toast("Please select a file type")
    //     return
    //   }

    //   let content;
    //   if(file_type === "aws"){
    //      // for aws, folder and file is required
    //       if(!folder){
    //         toast("Please select the input folder")
    //         return
    //       }
    
    //       if(!file){
    //         toast("Please select the input file")
    //         return
    //       }

    //       content = `${folder}/${file}`
    //   }

    //   if(file_type === "upload"){
    //     // file is required
    //     if(!fileByte){
    //         toast("Please select a file")
    //         return
    //     }

    //     content = fileByte
    //   }

    if (!input_files || input_files.length === 0){
        toast("please select at least one input file.")
        return
    }

    if (!output_files || output_files.length === 0){
        toast("please select at least one output file.")
        return
    }



      setLoding(true)
      const resp:any = await createProject(name, description, date_created,input_files, output_files,token)
      const jsonResp = await resp.json()

      if(jsonResp.error){
        toast(jsonResp.message)
        setLoding(false)
        return
      }
      setLoding(false)

      dispatch(addOne({
        project_id: jsonResp.message.id,
        name : jsonResp.message.project_name,
        description: jsonResp.message.project_description,
        file_type: jsonResp.message.file_type,
        file: jsonResp.message.file,
        date_created: jsonResp.message.date_created
        
      }))
      navigate("/projects")
    }

    const handleUpdateProject = async () => {
        
            
        const {name, description, folder, file, date_created, file_type, fileByte } = projectData
        
        
  
        if(!name){
          toast("Please enter project name")
          return
        }
  
        if(!description){
          toast("Please enter project description")
          return
        }
  
        let content;
        if(file_type === "aws"){
           // for aws, folder and file is required
            if(!folder){
              toast("Please select the input folder")
              return
            }
      
            if(!file){
              toast("Please select the input file")
              return
            }
  
            content = `${folder}/${file}`
        }
  
        if(file_type === "upload"){
          // file is required
          if(!fileByte){
              toast("Please select a file")
              return
          }
  
          content = fileByte
        }
  
  
        setLoding(true)
        const resp:any = await updateProject(selectedProjectId, name, description, content, date_created, file_type,token)
        const jsonResp = await resp.json()
  
        if(jsonResp.error){
          toast(jsonResp.message)
          setLoding(false)
          return
        }
        dispatch(updateOne({
            project_id: selectedProjectId,
            name,
            description,
            file: content,
            date_created,
            file_type

        }))
        setLoding(false)
        navigate("/projects")
    }

    const handleFileUpload = async (e:any) => {
        const file = e.target.files[0]

        const base64Data:any = await toBase64(file)

        const result = base64Data?.split(";base64,")[1]
        
        if(!result){
            toast("Select a valid file")
            return
        }


        setProjectData((state:any) => {
            return {
                ...state,
                fileByte : result
            }
        })
    }

    const handleSetOutput = (e:any) => {
        setOutputFile((state:any) => ({...state, file : e.target.value}));
    }

    const FileOptions = [{ label: "AWS", value: "aws"}, { label: "Upload", value : "upload"}]

    // console.log("selected project", selectedProject)

    const handleAddFile = (type:string) => {
        if(type === "input"){
            // const { folder, file } = inputFile

            // if(!folder){
            //     toast.error("")
            // }

            setProjectData((state:any) => (
                {...state, input_files : [...state.input_files, inputFile]}
            ))

            setInputFile(INITIAL_INPUT_FILE)
            inputFilesFunctions.close()
        }

        if(type === "output"){
            setProjectData((state:any) => (
                {...state, output_files : [...state.output_files, outputFile]}
            ))
            console.log("Project data output files: ", projectData.output_files)
            setOutputFile(INITIAL_OUTPUT_FILE)
            outputFilesFunctions.close()
        }
    }

    console.log("project data: ", projectData)

    return (
        <>
            <div className={`project-container flex justify-center ${open ? "sidenav-open" : ""}`}>
                {/* <div className="project w-[75%] mx-auto"> */}

                {!loading ? (
                    <div className="w-full mt-3">
                        <div className="flex justify-center">
                            <p className="font-semibold uppercase">{selectedProject ? "Edit Project" : "Add Project"}</p>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex mt-4 justify-between gap-2 items-center">
                                <p className="text-xs">Project&nbsp;:</p>
                                <div className=" w-[90%]">
                                    <InputText  placeholder="Enter project name" styleClass="rounded-none input-sm" value={projectData.name} changeFn={(e:any) => {handleInputChange(e, "name")}} />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-between items-center">
                                <p className="text-xs">Description&nbsp;:</p>
                                <div className="w-[90%]">
                                    <TextArea placeholder="Project description" styleClass="rounded-none mt-4 textarea-sm" value={projectData.description} changeFn={(e:any) => {handleInputChange(e, "description")}} />
                                </div>
                            </div>
                            {/* <Select placeholder="Select file type" styleClass="mt-4" value={projectData.file_type || null} options={FileOptions} changeFn={(e:any) => {handleInputChange(e, "file_type")}} />
                                    {projectData.file_type === "aws" ? (
                                         <div className="flex gap-4 mt-4">
                                        <Select placeholder="Select Folder" value={projectData.folder || null} options={getFileCount(awsDir)} changeFn={(e:any) => handleFilePath(e, "folder")} />
                                        <Select placeholder="Select File" value={projectData.file || null} options={getFileName(selectedFolder || projectData.folder)} changeFn={(e:any) => handleFilePath(e, "file")} />
                                        <Button variant="primary" size="sm" styleClasses="!h-fit" clickFn={fetchAwsDir}>
                                            <div className={`${awsLoading ? "animate-spin" : ""}`}>
                                                <IoMdRefresh color="white"/>
                                            </div>
                                        </Button>
                                        </div>
                                    ) : null}

                                    {projectData.file_type === "upload" ? (
                                         <div className="flex gap-4 mt-4">
                                            <input type="file" accept="txt" className="file-input file-input-sm file-input-primary file-input-bordered w-full" onChange={(e:any) => handleFileUpload(e)} />
                                        </div>
                                    ) : null} */}

                            {/* input files table */}
                            <div className="mt-4">
                                <div className="table h-[30vh]">
                                    <div className="table-heading border-b-black">
                                        <div className="ml-2 !py-[5px]">Input Files</div>
                                        <div className="flex gap-2 ml-2 !py-[5px] mr-2">
                                            <Button clickFn={() => handleDeleteFile("input")} size="xs" styleClasses="!rounded-none border-[#007791] bg-[#007791] text-white">Delete Files</Button>
                                            <Button clickFn={() => inputFilesFunctions.open()} size="xs" styleClasses="!rounded-none border-[#007791] bg-[#007791] text-white">Add File</Button>
                                        </div>
                                    </div>
                                    <div className="table-heading">
                                        <div style={{ width: "3%" }} className="border-black border-r !py-[5px]">&nbsp;</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">File Name</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">Description</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">Lines</div>
                                        <div style={{ width: "25%" }} className=" ml-2 !py-[5px]">Date Uploaded</div>
                                    </div>
                                    <div className="table-body">
                                        {/* {projectData.input_files.map((files: any)) =>( 
                                            <div>
                                                <Checkbox />
                                            <div>
                                        )} */}

                                            {projectData.input_files.map((file:any, index) => (
                                                <div className="table-data" key={index}>
                                                    <div style={{ width: "3%" }} className="table-data-container border-black border-r !py-[5px]  flex justify-center">
                                                        <Checkbox 
                                                         checked={selectedInputFiles.includes(file.id)}
                                                         onChange={(e) => handleSelectInputFile(e.target.checked, file.id)}/>
                                                    </div>
                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                        <p>{file.file}</p>
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container ml-2">
                                                    </div>
                                                </div>
                                            ))}

                                    </div>
                                </div>
                            </div>

                            {/* output files table */}
                            <div className="mt-2">
                                <div className="table h-[30vh]">
                                    <div className="table-heading border-b-black">
                                        <div className="ml-2 !py-[5px]">Expected Output Files</div>
                                        <div className="flex gap-2 ml-2 !py-[5px] mr-2">
                                            <Button clickFn={() => handleDeleteFile("output")} size="xs" styleClasses="!rounded-none border-[#007791] bg-[#007791] text-white">Delete Files</Button>
                                            <Button clickFn={() => outputFilesFunctions.open()} size="xs" styleClasses="!rounded-none border-[#007791] bg-[#007791] text-white">Add File</Button>
                                        </div>
                                    </div>
                                    <div className="table-heading">
                                        <div style={{ width: "3%" }} className="border-black border-r !py-[5px]">&nbsp;</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">File Name</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">Description</div>
                                        <div style={{ width: "25%" }} className="border-black border-r ml-2 !py-[5px]">Lines</div>
                                        <div style={{ width: "25%" }} className=" ml-2 !py-[5px]">Date Uploaded</div>
                                    </div>
                                    <div className="table-body">
                                        {projectData.output_files.map((file:any, index) => (
                                                <div className="table-data" key={index}>
                                                    <div style={{ width: "3%" }} className="table-data-container border-black border-r !py-[5px]  flex justify-center">
                                                        <Checkbox 
                                                         checked={selectedInputFiles.includes(file.id)}
                                                         onChange={(e) => handleSelectInputFile(e.target.checked, file.id)}/>
                                                    </div>
                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                        <>{console.log("file: ", file)}</>
                                                        <p>{file.file}</p>
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container border-black border-r ml-2 !py-[5px]">
                                                    </div>

                                                    <div  style={{ width: "25%" }} className="table-data-container ml-2">
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-3">
                                <Button size="sm" clickFn={() => handleCreateProject()} styleClasses="btn-accent !rounded-sm text-white">Save Project</Button>
                            {/* {selectedProject ? (<Button variant="primary" size="sm"  styleClasses={`${loading ? "btn-disabled" : ""} !text-xs`} clickFn={handleUpdateProject}>Update Project</Button>): (<Button variant="primary" size="sm" styleClasses={`${loading ? "btn-disabled" : ""} !text-xs`} clickFn={handleCreateProject}>Create Project</Button>)} */}
                            </div>
                        </div>
                    </div>

                ) : (
                    <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
                    </div>
                )}

                {/* </div> */}
            </div>

            {/* add input files modal */}
            <Modal opened={inputOpend} onClose={inputFilesFunctions.close} title="Add Input Files" centered size={"lg"}>
                <div className="flex gap-4 mt-4">
                    <Select placeholder="Select Folder" value={inputFile.folder || null} options={getFileCount(awsDir)} changeFn={(e:any) => setInputFile((state:any) => ({...state, folder : e.target.value}))} />
                    <Select placeholder="Select File" value={inputFile.file || null} options={getFileName(inputFile.folder || projectData.folder)} changeFn={(e:any) => setInputFile((state:any) => ({...state, file : e.target.value}))} />
                    <Button variant="primary" size="sm" styleClasses="!h-fit" clickFn={fetchAwsDir}>
                        <div className={`${awsLoading ? "animate-spin" : ""}`}>
                            <IoMdRefresh color="white"/>
                        </div>
                    </Button>
                </div>

                <div className="flex justify-end mt-8">
                    <Button variant="accent" size="sm" styleClasses="rounded-none text-white" clickFn={() => handleAddFile("input")}>Add</Button>
                </div>
            </Modal>

            {/* add output files modal */}
            <Modal opened={outputOpened} onClose={outputFilesFunctions.close} title="Add Output Files" centered size={"lg"}>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-4">
                        <Select placeholder="Select Folder" value={outputFile.folder || null} options={getFileCount(awsDir)} changeFn={(e:any) => setOutputFile((state:any) => ({...state, folder : e.target.value}))} />
                        {/* <Select placeholder="Select File" value={projectData.output_file || null} options={getFileName(selectedFolder || projectData.folder)} changeFn={(e:any) => handleFilePath(e, "file")} /> */}
                        <Button variant="primary" size="sm" styleClasses="!h-fit" clickFn={fetchAwsDir}>
                            <div className={`${awsLoading ? "animate-spin" : ""}`}>
                                <IoMdRefresh color="white"/>
                            </div>
                        </Button>
                    </div>
                    <InputText styleClass="input-sm" value={outputFile.file} changeFn={(e:any) => handleSetOutput(e)}/>
                </div>

                <div className="flex justify-end mt-8">
                    <Button variant="accent" size="sm" styleClasses="rounded-none text-white" clickFn={() => handleAddFile("output")}>Add</Button>
                </div>
            </Modal>
        </>
    )
}


// const inputFilesModal = (opened:boolean, close:any) => {
//     return (
//         <>
//           <Modal opened={opened} onClose={close} title="Authentication" centered>
//             {/* Modal content */}
//           </Modal>
    
//           {/* <Button onClick={open}>Open centered Modal</Button> */}
//         </>
//       );
//     }