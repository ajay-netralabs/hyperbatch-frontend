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

    // useEffect(() => {
    //     setJobsCopy(jobs)
    // }, [jobs])


    const fetchProjects = async () => {
        try {
            setLoading(true)
            const AllJobs = await getAllJobs(token);

            if (Array.isArray(AllJobs)) {
                dispatch(addJob(AllJobs));
                dispatch(addFetch("jobs"))
            } else {
                toast.error(AllJobs.message || "Unexpected error occurred.")
            }
            setLoading(false)
        } catch (error) {
            toast.error("Unexpected Error, please contact support.")
            console.error('Error fetching projects:', error);
            setLoading(false)
        }
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
            dispatch(addCurrentJob(id))
            navigate("/jobs/create")

        }
        return (
            <div className={`project-container ${open ? "sidenav-open" : ""}`}>
                <div className="w-full flex flex-col justify-center item-center mx-auto" >
                    <div className="flex justify-between">
                        <h1 className="top-heading"></h1>
                        <button
                            className="btn btn-primary ml-10 !text-xs"
                            onClick={() => navigate("/jobs/create")}
                        >
                            <FaPlus size={14} className="" />
                            <b>Create Job</b>
                        </button>
                    </div>

                    <div className="table-holder">
                        <div className="table">
                            <div className="table-heading">
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
                                <div style={{ width: "25%" }}>Job Name</div>
                                <div style={{ width: "25%" }}>
                                    Job Description
                                </div>
                                <div style={{ width: "25%" }}>
                                    Selected Project
                                </div>

                                <div style={{ width: "20%" }}>
                                    Date Created
                                </div>
                                <div style={{ width: "5%" }} className="text-center">
                                    Actions
                                </div>
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
                                            {/* <div style={{ width: "5%" }}>
                                  <Checkbox
                                      color="#036ca1"
                                  />
                              </div> */}
                                            <div
                                                style={{ width: "25%", color: "#1f78a5" }} className="font-semibold hover:cursor-pointer" onClick={() => handleRowClick(item.job_id)}
                                            // className="table-data__title flex items-center"

                                            >
                                                {item.name}
                                            </div>

                                            <div
                                                style={{ width: "25%" }} className="text-xs"
                                            // className="table-data__description flex items-center"

                                            >
                                                {item.description}
                                            </div>

                                            <div
                                                style={{ width: "25%" }} className="text-xs"
                                            // className="table-data__file flex items-center"

                                            >
                                                {item.project_name}
                                            </div>

                                            <div
                                                style={{ width: "20%" }} className="text-xs"
                                            // className="table-data__date flex items-center"

                                            >
                                                {item.date_created}
                                            </div>
                                            <Menu withArrow arrowPosition="center" shadow="md"> 
                                                <Menu.Target>
                                            <div
                                                style={{ width: "5%" }} className="flex justify-center cursor-pointer hover:scale-105 transition"
                                            >
                                                {/* onClick={() => handleDeleteProject(item.id)} */}
                                                <HiOutlineDotsHorizontal />
                                            </div>
                                            </Menu.Target>
                                            <Menu.Dropdown  className="prompt-dropdown">
                                                <Menu.Item className="prompt-dropdown-item border-top" onClick={() =>handleDeleteJob(item.job_id)}>
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                            </Menu>
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