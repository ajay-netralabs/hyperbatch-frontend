import "./wizard.css"
// import React from 'react'
// import Card from "../../components/form/Card"
import "../Projects/project.css";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addJob, deleteJob } from "../../store/slices/job.slice";
import { getAllJobs, deleteData } from "../../services/ApiServices";
import { toast } from "react-toastify";
import { addCurrentJob } from "../../store/slices/currentResources";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { IJob } from "../../store/slices/job.slice";
import Cookies from 'universal-cookie';
import { addFetch } from "../../store/slices/fetchedResources";
import { Checkbox } from '@mantine/core';

const WizardHome = () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")
    const navigate = useNavigate();
    const open = useSelector((state: any) => state.sidebar.open);
    const jobs = useSelector((state: any) => state.jobs.jobs);
    const dispatch = useDispatch();
    // const [jobsCopy , setJobsCopy] = useState<IJob[]>([]);
    const [loading, setLoading] = useState(false)

    const alreadyFetchedJobs = useSelector((state:any) => state.fetchedResources.jobs)

    const [selectedJob, setSelectedJob] = useState<any|null>(null)
    // useEffect(() => {
    //     setJobsCopy(jobs)
    // }, [jobs])


    const fetchProjects = async () => {
        // try {
        //     setLoading(true)
        //     const AllJobs = await getAllJobs(token);

        //     if (Array.isArray(AllJobs)) {
        //         dispatch(addJob(AllJobs));
        //         dispatch(addFetch("jobs"))
        //     } else {
        //         toast.error(AllJobs.message || "Unexpected error occurred.")
        //     }
        //     setLoading(false)
        // } catch (error) {
        //     toast.error("Unexpected Error, please contact support.")
        //     console.error('Error fetching projects:', error);
        //     setLoading(false)
        // }
    };

    useEffect(() => {
        if (!jobs.length && !alreadyFetchedJobs) fetchProjects();
    }, []);


    const handleDeleteJob = async (job_id: string) => {
        try {
            const ids: string[] = [];
            ids.push(job_id);
            setLoading(true)
            const res = await deleteData(ids, "jobs", token);
            if (res && res.ok) {
                const result = await res.json();
                if (result.error === true) {
                    toast.error(result.message);
                } else {
                    dispatch(deleteJob({job_id}))
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


    const handleRowClick = (id: string) => {
        console.log("id", id)
        dispatch(addCurrentJob(id))
        navigate("/jobs/create")

    }

    const handleSelectJob = (selected:boolean, job:any) => {
        if(selected){
            setSelectedJob(job)
        }else{
            setSelectedJob(null)
        }
    }

    console.log("selected job", selectedJob)

    return (
        <div className={`project-container ${open ? "sidenav-open" : ""}`}>
            <div className="w-full flex flex-col justify-center item-center mx-auto my-3" >
                <div className="flex justify-center">
                    <h1 className="top-heading font-semibold">JOBS</h1>
                </div>
                <div className="flex justify-end">
                    <button
                        className={`btn btn-primary ml-2 !text-xs btn-accent text-white !rounded-sm ${selectedJob ? "" : "btn-disabled"}`}
                        onClick={() => navigate(`/jobs/run/${selectedJob.job_id}`)}
                    >
                        {/* <FaPlus size={14} className="" /> */}
                        <b>Run Job</b>
                    </button>
                    <button
                        className={`btn btn-primary ml-2 !text-xs btn-accent text-white !rounded-sm ${selectedJob ? "" : "btn-disabled"}`}
                        onClick={() => handleRowClick(selectedJob.job_id)}
                    >
                        {/* <FaPlus size={14} className="" /> */}
                        <b>Edit Job</b>
                    </button>
                    <button
                        className="btn btn-primary ml-2 !text-xs btn-accent text-white !rounded-sm"
                        onClick={() => navigate("/jobs/create")}
                    >
                        {/* <FaPlus size={14} className="" /> */}
                        <b>Add Job</b>
                    </button>
                </div>

                <div className="table-holder">
                    <div className="table">
                        <div className="table-heading">
                            {/* for checkbox */}
                            <div style={{ width: "3%" }} className="border-black border-r">&nbsp;</div>
                            {/* for status light */}
                            <div style={{ width: "2%" }} className="border-black border-r">&nbsp;</div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">Job Name</div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">
                                Job Description
                            </div>
                            <div style={{ width: "25%" }} className="border-black border-r ml-2">
                                Selected Project
                            </div>

                            <div style={{ width: "20%" }} className="border-black border-r ml-2">
                                Date Created
                            </div>
                            {/* <div style={{ width: "5%" }} className="text-center">
                                Actions
                            </div> */}
                        </div>

                        {loading ? (
                            <div className="table-body">
                                <div className="h-[50vh] mt-2 flex justify-around items-center">
                                    <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin" />
                                </div>
                            </div>
                        ) : (
                            <div className="table-body">
                                {jobs.length ? jobs.map((item: any) => (
                                    <div className="table-data" key={item.job_id}>
                                        {/* checkbox */}
                                        <div className="table-data-container border-black border-r " style={{ width: "3%" , color: "#1f78a5"}}>
                                            <div className="mx-auto">
                                                <Checkbox
                                                    color="rgba(0, 0, 0, 1)"
                                                    radius="xs"
                                                    variant="outline"
                                                    checked={selectedJob?.job_id === item.job_id}
                                                    disabled={selectedJob && selectedJob?.job_id !== item.job_id }
                                                    onChange={(event) => handleSelectJob(event.currentTarget.checked, item)}
                                                />
                                            </div>
                                        </div>

                                        {/* status light */}
                                        <div className="table-data-container border-black border-r " style={{ width: "2%" , color: "#1f78a5"}}>
                                            <div className="mx-auto">
                                                {/* <Checkbox
                                                    color="rgba(0, 0, 0, 1)"
                                                    radius="xs"
                                                    variant="outline"
                                                    
                                                /> */}
                                                {/* <div className="indicator"> */}
                                                    <div className="indicator-item badge badge-xs badge-success"></div> 
                                                    {/* <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div> */}
                                                {/* </div> */}
                                            </div>
                                        </div>
                                        <div style={{ width: "25%" , color: "#1f78a5"}} className="table-data-container font-semibold border-black border-r ml-2">
                                            <div
                                            >
                                                {/* onClick={() => handleRowClick(item.job_id)} */}
                                                {item.name}
                                            </div>
                                        </div>
                                        
                                        <div style={{ width: "25%" }} className="table-data-container border-black border-r ml-2">
                                            <div
                                                    className="text-xs"

                                            >
                                                {item.description}
                                            </div>
                                        </div>

                                        <div style={{ width: "25%" }} className="table-data-container border-black border-r ml-2">
                                            <div
                                                    className="text-xs"

                                            >
                                                {item.project_name}
                                            </div>
                                        </div>

                                        <div style={{ width: "20%" }} className="table-data-container ml-2">
                                            <div
                                                    className="text-xs"

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
                                            <Menu.Item className="prompt-dropdown-item border-top" onClick={() =>handleDeleteJob(item.job_id)}>
                                                Delete
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                        </Menu> */}
                                    </div>



                                )) : <div className="h-[50vh] mt-2 flex justify-around items-center">
                                    <p className="text-lg">You don't have any jobs</p>
                                </div>}
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}

    export default WizardHome