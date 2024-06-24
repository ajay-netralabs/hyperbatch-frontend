import { Outlet } from "react-router-dom";
import { Footer, NavBar, SideNav } from "./components";
import { useEffect } from "react";
import { getAllJobs, getAllProjects } from "./services/ApiServices";
import Cookies from 'universal-cookie';
import { useDispatch } from "react-redux";
import { addJob } from "./store/slices/job.slice";
import { addProject } from "./store/slices/project.slice";

export default function NavbarLayout () {

    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")

    const dispatch = useDispatch()

    //
    useEffect(() => {
        console.log("navbar layout running [LAYOUT]")
        fetchJobs()
        fetchProjects()
    }, [])

    const fetchJobs = async () => {
        // fetch job
        const allJobs = await getAllJobs(token)
        if(Array.isArray(allJobs)){
            dispatch(addJob(allJobs))
        }
        // console.log("all jobs", allJobs)
    }

    const fetchProjects = async () => {
        // fetch projects
        const allProjects = await getAllProjects(token)
        if(Array.isArray(allProjects)){
            dispatch(addProject(allProjects))
        }

    }

    const fetchVariables = async () => {

    }

    return (
        <div>
            <NavBar />
            <SideNav />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}