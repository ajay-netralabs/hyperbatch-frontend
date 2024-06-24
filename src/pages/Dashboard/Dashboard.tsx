import { useNavigate } from "react-router-dom"
// import { SideNav } from "../../components"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllJobs, getAllProjects, getAllVariables } from "../../services/ApiServices"
import { addProject } from "../../store/slices/project.slice"
import { addJob } from "../../store/slices/job.slice"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Cookies from 'universal-cookie';
import { addFetch } from "../../store/slices/fetchedResources"
import { addVariable } from "../../store/slices/variables.slice"

export const Dashboard = () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")
    const navigate = useNavigate()

    const dispatch = useDispatch()

    // const [jobs, projects] = useSelector((state: any) => [state.jobs, state.projects])
    const open = useSelector((state: any) => state.sidebar.open);
    const jobs = useSelector((state:any) => state.jobs.jobs)
    const projects = useSelector((state:any) => state.projects.projects)
    const variables = useSelector((state:any) => state.variables.variables)

    const fetchedResources = useSelector((state: any) => state.fetchedResources)

    useEffect(() => {
        navigate("/projects")
    }, [])

    // useEffect(() => {
    //     const fetchAll = async() => {

    //         if(!projects.length && !fetchedResources.projects){
    //             try{
    //                 const projects = await getAllProjects(token);
    //                 if (Array.isArray(projects)) {
    //                     // const projectsWithoutFilePath = AllProjects.map(project => ({
    //                     //     ...project,
    //                     //     filePath: project.filePath ? project.filePath.split('/').pop() : '',
    //                     // }));
    //                     //@ts-ignore
    //                     dispatch(addProject(projects));
    //                     dispatch(addFetch("projects"))
    //                 }
    
    //             }catch(err){
    
    //             }
    //         }

    //         if(!jobs.length && !fetchedResources.jobs){
    //             try{
    //                 const jobs = await getAllJobs(token)
    
    //                 if (Array.isArray(jobs)) {
    //                     dispatch(addJob(jobs));
    //                     dispatch(addFetch("jobs"))
    //                 }
    
    //             }catch(err){
    
    //             }
    //         }

    //         if(!variables.length && !fetchedResources.variables){
    //             try{
    //                 const variables = await getAllVariables(token)
    
    //                 if (Array.isArray(variables)) {
    //                     dispatch(addVariable(variables));
    //                     dispatch(addFetch("variables"))
    //                 }
    
    //             }catch(err){
    
    //             }
    //         }


    //         // navigate to projects since dashboard is not available right now
    //         navigate("/projects")
    //     }

    //     fetchAll()
    // }, [])

    return(
        <div className={`project-container flex justify-center items-center ${open ? "sidenav-open" : ""}`}>
            <AiOutlineLoading3Quarters color="#036ca1" fontSize={"40px"} className="animate-spin"/>
        </div>
    )
}