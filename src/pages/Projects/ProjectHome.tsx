// import React from "react";
import "./project.css";
import { FaPlus } from "react-icons/fa6";
import { Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addProject, deleteProject } from "../../store/slices/project.slice";
import { getAllProjects, deleteData } from "../../services/ApiServices";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCurrentProject } from "../../store/slices/currentResources";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Cookies from 'universal-cookie';
import { addFetch } from "../../store/slices/fetchedResources";
import { Checkbox } from '@mantine/core';

 
const ProjectHome = () => {


    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")
    const navigate = useNavigate();
    const open = useSelector((state: any) => state.sidebar.open);
    const projects = useSelector((state : any) => state.projects.projects);
    const dispatch = useDispatch(); 

    const alreadyFetchedProjects = useSelector((state:any) => state.fetchedResources.projects)


    const [selectedProject, setSelectedProject] = useState<any|null>(null)

    const [loading, setLoading] = useState(false)

    // const fetchProjects = async () => {
        // try {
        //     setLoading(true)
        //     const AllProjects = await getAllProjects(token); 
        //     if (Array.isArray(AllProjects)) {
        //         dispatch(addProject(AllProjects));
        //         dispatch(addFetch("projects"))
        //     } else {
        //         toast.error(AllProjects.message || "Unexpected error occurred.");
        //     }
        //     setLoading(false)
        // } catch (error) {
        //     toast.error("Unexpected Error, please contact support.")
        //     console.error('Error fetching projects:', error);
        //     setLoading(false)
        // }
    // };

    // useEffect(() => {
    //     if(!projects.length && !alreadyFetchedProjects) fetchProjects();
    // }, []);
    
    console.log("selectedProject", selectedProject)

    const handleRowClick = (id:string) => {
        dispatch(addCurrentProject(id))
        navigate("/projects/create")
    }

    const handleDeleteProject = async (project_id: string) => {
        try {
            const ids: string[] = [];
            ids.push(project_id);
            setLoading(true)
            const res = await deleteData(ids, "projects", token);
            if (res && res.ok) {
                const result = await res.json();
                if (result.error === true) {
                    toast.error(result.message);
                } else {
                    dispatch(deleteProject({project_id}))
                    toast.success("Successfully deleted!")
                }
            }
        } catch (error){
            toast.error("Something went wrong");
            console.log(error);

        } finally{
            setLoading(false)
        }
    }

    const handleSelectProject = (selected:boolean, project:any) => {
        if(selected){
            setSelectedProject(project)
        }else{
            setSelectedProject(null)
        }
    }

    return (
        <div className={`project-container ${open ? "sidenav-open" : ""}`}>
            <div className="w-full flex flex-col justify-center item-center mx-auto" >
                <div className="flex justify-center mt-3">
                    <h1 className="top-heading font-semibold">PROJECTS</h1>
                    {/* <div className="absolute right-0 my-auto">
                        <button
                            className={`btn btn-md btn-accent text-white !text-xs !rounded-sm ${selectedProject ? "" : "btn-disabled"}`}
                        onClick={() => navigate("/projects/create")}
                        >
                            <b>Edit Project</b>
                        </button>
                        <button
                            className="btn btn-md btn-accent text-white ml-2 !text-xs !rounded-sm"
                        onClick={() => navigate("/projects/create")}
                        >
                            <b>Add Project</b>
                        </button>

                    </div> */}
                </div>

                <div className="flex justify-end">
                        <button
                            className={`btn btn-md btn-accent text-white !text-xs !rounded-sm ${selectedProject ? "" : "btn-disabled"}`}
                        onClick={() => handleRowClick(selectedProject._id)}
                        >
                            <b>Edit Project</b>
                        </button>
                        <button
                            className="btn btn-md btn-accent text-white ml-2 !text-xs !rounded-sm"
                        onClick={() => navigate("/projects/create")}
                        >
                            <b>Add Project</b>
                        </button>

                    </div>

                <div className="table-holder">
                    <div className="table">
                        <div className="table-heading bg-table-heading">
                            {/* <div style={{ width: "5%" }}>
                                <Checkbox
                                    color="#036ca1"
                                //   checked={selectedBatch.length > 0}
                                //   onClick={handleSelectAllBatch}
                                //   indeterminate={
                                //     selectedBatch.length > 0 &&
                                //     selectedBatch.length < batches.length
                                //   }
                                />
                            </div> */}
                            <div style={{ width: "3%" }} className="border-black border-r">&nbsp;</div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">Project Name</div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">
                                Project Description
                            </div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">
                                Project File
                            </div>

                            <div style={{ width: "20%" }} className="border-black border-r ml-2">
                                Date Created
                            </div>
                            {/* <div style={{ width:"5%" }} className="text-center">
                                Actions
                            </div> */}
                        </div>


                        {loading ? (
                            <div className="table-body">
                            <div className="h-[50vh] mt-2 flex justify-around items-center">
                                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin"/>
                            </div>
                        </div>
                        ) : (
                        <div className="table-body">
                            {projects.length ? projects.map((item : any) => (
                                <div className="table-data" key={item.project_id}>
                                    <div className="table-data-container border-black border-r " style={{ width: "3%" , color: "#1f78a5"}}>
                                        <div className="mx-auto">
                                            <Checkbox
                                                color="rgba(0, 0, 0, 1)"
                                                radius="xs"
                                                variant="outline"
                                                checked={selectedProject?.project_id === item.project_id}
                                                disabled={selectedProject && selectedProject?.project_id !== item.project_id }
                                                onChange={(event) => handleSelectProject(event.currentTarget.checked, item)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div style={{ width: "25%" , color: "#1f78a5"}} className="table-data-container font-semibold border-black border-r ml-2">
                                        <div>
                                            {item.name}
                                        </div>
                                    </div>

                                    <div style={{ width: "25%" }} className="table-data-container text-xs border-black border-r ml-2">
                                        <div
                                             className=""

                                        >
                                            {item.description}
                                        </div>
                                    </div>

                                    <div style={{ width: "25%" }} className="table-data-container text-xs border-black border-r ml-2">
                                        <div
                                             className=""

                                        >
                                            {item.input_files[0]?.file}
                                            {/* {item.file_type === "aws" ? item.file.split("/")[1] : "locally uploaded"} */}
                                        </div>
                                    </div>

                                    <div  style={{ width: "20%" }} className="table-data-container text-xs ml-2">
                                        <div
                                            className=""

                                        >
                                            {item.date_created}
                                        </div>
                                    </div>
                                    {/* <Menu withArrow arrowPosition="center" shadow="md"> 
                                                <Menu.Target>
                                            <div
                                                style={{ width: "5%" }} className="flex justify-center cursor-pointer hover:scale-105 transition"
                                            >
                                                <HiOutlineDotsHorizontal />
                                            </div>
                                            </Menu.Target>
                                            <Menu.Dropdown  className="prompt-dropdown">
                                                <Menu.Item className="prompt-dropdown-item border-top" onClick={() =>handleDeleteProject(item.project_id)}>
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                    </Menu> */}
                                </div>



                            )) : (
                                <div className="h-[50vh] mt-2 flex justify-around items-center">
                                    <p className="text-lg">You don't have any projects</p>
                                </div>  
                            )}
                        </div>

                        )}


                        {/* <thead>
                            <tr className="">
                                <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                                </th>
                                <th>Project Name</th>
                                <th>Project Description</th>
                                <th>Project File</th>
                                <th>Date Created</th>
                            </tr>
                        </thead>


                        <tbody>
                            {projects && projects.map((item : any) => ( 
                                <tr className="">
                                    <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                    </th>
                
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="">{item.name}</div>
                                        </div>  
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="">{item.filePath}</div>
                                        </div>  
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="">Hart Hagerty</div>
                                        </div>  
                                    </td>

                                    <td className="">
                                        <div className="flex items-center gap-3">
                                            <div className="">{item.date_created}</div>
                                        </div>  
                                    </td>
                                </tr>
                            ))}
                        </tbody> */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectHome;
