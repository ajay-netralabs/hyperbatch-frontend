import { useDispatch, useSelector } from "react-redux"
import "./project.css"

import { IoMdRefresh } from "react-icons/io";

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
export const CreateProject = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const open = useSelector((state:any) => state.sidebar.open)

    const allProjects = useSelector((state:any) => state.projects.projects)
    const selectedProjectId = useSelector((state: any) => state.selectedResource.projectId)
    const selectedProject = allProjects.find((project:any) => project.project_id === selectedProjectId)

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
                date_created : currentDate
            }

        }else{
            return {
                name : "",
                description : "",
                folder : "",
                file: "", // file content || filepath
                file_type : "",
                fileByte : "",
                date_created : currentDate
            }
        }
    })

    const [loading, setLoding] = useState(false)

    const [awsDir, setAwsDir]:any = useState({})
    const [awsLoading, setAwsLoading] = useState(false)

    const [selectedFolder, setSelectedFolder] = useState("")


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const AllProjects = await getAllProjects(token); 
                if (Array.isArray(AllProjects)) {
                    // const projectsWithoutFilePath = AllProjects.map(project => ({
                    //     ...project,
                    //     filePath: project.filePath ? project.filePath.split('/').pop() : '',
                    // }));
                    //@ts-ignore
                    dispatch(addProject(AllProjects));
                } 
            } catch (error) {
               
            }
        };

        if(!allProjects.length){
            fetchProjects()
        }
    },[])

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

      const { name, description, folder, file, date_created, file_type, fileByte } = projectData

      if(!name){
        toast("Please enter project name")
        return
      }

      if(!description){
        toast("Please enter project description")
        return
      }

      if(!file_type){
        toast("Please select a file type")
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
      const resp:any = await createProject(name, description, content, date_created, file_type,token)
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

    const FileOptions = [{ label: "AWS", value: "aws"}, { label: "Upload", value : "upload"}]

    return (
        <>
            <div className={`project-container flex justify-center ${open ? "sidenav-open" : ""}`}>
                {/* <div className="project w-[75%] mx-auto"> */}

                {!loading ? (
                    <div className="w-full">
                        <p className="font-semibold">Create Project</p>
                        <div className="w-full flex flex-col gap-4">
                            <InputText  placeholder="Enter project name" styleClass="mt-4 input-sm" value={projectData.name} changeFn={(e:any) => {handleInputChange(e, "name")}} />
                            <TextArea placeholder="Project description" styleClass="mt-4 textarea-sm" value={projectData.description} changeFn={(e:any) => {handleInputChange(e, "description")}} />
                            <Select placeholder="Select file type" styleClass="mt-4" value={projectData.file_type || null} options={FileOptions} changeFn={(e:any) => {handleInputChange(e, "file_type")}} />
                            {/* <div className="flex gap-4 mt-4"> */}
                                    {projectData.file_type === "aws" ? (
                                         <div className="flex gap-4 mt-4">
                                        <Select placeholder="Select Folder" value={projectData.folder || null} options={getFileCount(awsDir)} changeFn={(e:any) => handleFilePath(e, "folder")} />
                                        <Select placeholder="Select File" value={projectData.file || null} options={getFileName(selectedFolder || projectData.folder)} changeFn={(e:any) => handleFilePath(e, "file")} />
                                        <Button variant="primary" size="sm" styleClasses="" clickFn={fetchAwsDir}>
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
                                    ) : null}
                            {/* </div> */}
                            <div className="w-[30%] flex mt-3">
                            {selectedProject ? (<Button variant="primary" size="sm"  styleClasses={`${loading ? "btn-disabled" : ""} !text-xs`} clickFn={handleUpdateProject}>Update Project</Button>): (<Button variant="primary" size="sm" styleClasses={`${loading ? "btn-disabled" : ""} !text-xs`} clickFn={handleCreateProject}>Create Project</Button>)}
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
        </>
    )
}