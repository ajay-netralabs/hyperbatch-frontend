import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const time = setTimeout(() => {
            navigate("/")
        }, 2000)

        return () => clearTimeout(time)
    })

    return (
        // <div className={` ${open ? "sidenav-open" : ""}`}>
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
                <p className="text-lg">Nothing here</p>
                <p className="text-sm">Redirecting you back...</p>
            </div>
        // </div>
    )
}