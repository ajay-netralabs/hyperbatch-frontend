import { shallowEqual, useSelector } from "react-redux"

export const Footer = () => {

    const [projectsCount, jobsCount] = useSelector((state:any) => [state.projects.projects, state.jobs.jobs], shallowEqual)

    console.log("projectsCount", projectsCount)
    console.log("jobsCount", jobsCount)

    return (
        <footer className="footer p-4 bg-base-100 text-base-content fixed z-40 border-t border-black bottom-0 ">
            <div className="flex justify-between items-center w-full">
                <div className="">
                    <div className="flex gap-2">
                        <p>Projects :</p>
                        <p>{projectsCount.length}</p>
                    </div>
                    <div className="flex gap-2">
                        <p>Jobs :</p>
                        <p>{jobsCount.length}</p>
                    </div>
                </div>
                <div>
                    Keygen data logo
                </div>
            </div>
        </footer>
    )
}