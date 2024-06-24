import { MdSpaceDashboard } from "react-icons/md";
import "./sidenav.css"
import { useSelector } from "react-redux";
import { Submenu } from "./Submenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiLayers } from "react-icons/fi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { CgPerformance } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";

import { BiLayerPlus } from "react-icons/bi";
import { RiQrScanFill } from "react-icons/ri";
import { FaBoxArchive } from "react-icons/fa6";

import { ImBoxAdd } from "react-icons/im";

const projectSubmenu =  [
    {
        icon : BiLayerPlus,
        name : "Create Project"
    },
    {
        icon : FiLayers,
        name : "Projects"
    },
]

const jobSubmenu =  [
    {
        icon : RiQrScanFill,
        name : "Create Job"
    },
    {
        icon : MdOutlineDocumentScanner,
        name : "Jobs"
    }
]

const variableSubmenu = [
    {
        icon : FaBoxArchive,
        name : "Create Variable"
    },
    {
        icon : ImBoxAdd,
        name : "Variables"
    }
]



export const SideNav = () => {
    const navigate = useNavigate()
    const open = useSelector((state: any) => state.sidebar.open)

    const [activeMenu, setActiveMenu] = useState("projects")

    // const [activeSubmenu, setActiveSubmenu] = useState("")

    // const [openMenu, setOpenMenu] = useState<any[]>([])

    // const calculateOpenMenu = (name:any) => {
    //   if(openMenu.includes(name)){
    //     setOpenMenu(state => {
    //         return state.filter(menu => menu !== name)
    //     })
    //   }else{
    //     setOpenMenu(state => {
    //         return [...state, name]
    //     })
    //   }

    //   setActiveMenu(name)
    //   if(name === "dashboard"){
    //     navigate("/")
    //   }
    // }


    // const sublist:any = {
    //     "Projects" : "/projects",
    //     "Create Project" : "/projects/create",
    //     "Jobs": "/jobs",
    //     "Create Job" : "/jobs/create",
    //     "Variables": "/variables",
    //     "Create Variable" : "/variables/create"
    // }

    // const navigateSubmenu = (name: string) => {
    //     const link = sublist[name]
    //     if(link){
    //         setActiveSubmenu(name)
    //         navigate(link)
    //     }
    // }

    const links:any = {
        "projects" : "/projects",
        "jobs" : "/jobs",
        "reports" : "/reports",
        "admin" : "/admin"
    }

    const handleMenuNavigation = (name:string) => {
        const link = links[name]

        if(link){
            setActiveMenu(name)
            navigate(link)
        }

    }

    return (
        // <div className={`sidenav font-medium shadow-md bg-base-100 flex flex-col w-[12%] h-full pt-4 ${open ? "open" : ""}`}>
        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => calculateOpenMenu("dashboard")}>
        //         <MdSpaceDashboard color={`${activeMenu === "dashboard" ? "#036da1" : "black" }`} fontSize="16px" />
        //         <span className="ml-2 font-semibold text-xs">Dashboard</span>
        //     </div>
        //     <hr />
        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "projects" ? "active" : ""}`} onClick={() => calculateOpenMenu("projects")}>
        //         <FiLayers color={`${activeMenu === "projects" ? "#036da1" : "black" }`} fontSize="16px"/>
        //         <span className="ml-2  font-semibold text-xs">Projects</span>
        //     </div>
        //     {openMenu.includes("projects") ? (
        //         projectSubmenu.map((menu, key)=> (
        //             <div key={key}>
        //             <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name) } isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
        //             <hr />
        //             </div>
        //         ))
        //     ) : null}

        //     <hr />
        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "jobs" ? "active" : ""}`} onClick={() => calculateOpenMenu("jobs")}>
        //         <MdOutlineDocumentScanner color={`${activeMenu === "jobs" ? "#036da1" : "black" }`} fontSize="16px"/>
        //         <span className="ml-2  font-semibold text-xs">Jobs</span>
        //     </div>

        //     {openMenu.includes("jobs") ? (
        //         jobSubmenu.map((menu, key) => (
        //             <div key={key}>
        //             <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name)} isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
        //             <hr />
        //             </div>
        //         ))
        //     ) : null}


        //     <hr /> 

        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "variables" ? "active" : ""}`} onClick={() => calculateOpenMenu("variables")}>
        //         <FaBoxArchive  color={`${activeMenu === "variables" ? "#036da1" : "black" }`} fontSize="16px"/>
        //         <span className="ml-2  font-semibold text-xs">Variables</span>
        //     </div>

        //     {openMenu.includes("variables") ? (
        //         variableSubmenu.map((menu, key) => (
        //             <div key={key}>
        //                 <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name)} isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
        //                 <hr />
        //             </div>
        //         ))
        //     ) : null}

        //     <hr />

        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "performance" ? "active" : ""}`} onClick={() => calculateOpenMenu("performance")}>
        //         <CgPerformance color={`${activeMenu === "performance" ? "#036da1" : "black" }`} fontSize="16px"/>
        //         <span className="ml-2  font-semibold text-xs">Performance</span>
        //     </div>

        //     <hr />
        //     <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "settings" ? "active" : ""}`} onClick={() => calculateOpenMenu("settings")}>
        //         <IoSettingsOutline color={`${activeMenu === "settings" ? "#036da1" : "black" }`} fontSize="16px"/>
        //         <span className="ml-2  font-semibold text-xs">Settings</span>
        //     </div>
        //     <hr />
        // </div>

        <div className={`sidenav-v2 font-medium shadow-md bg-base-100 flex flex-col w-[12%] h-full ${open ? "open" : ""}`}>
            <div className="m-auto">
                <div className="my-2 py-2 hover:cursor-pointer" onClick={() => handleMenuNavigation("projects")}>
                    <p className={`text-md ${activeMenu === "projects" ? "font-semibold" : ""}`}>Projects</p>
                </div>
                <div className="my-2 py-2 hover:cursor-pointer" onClick={() => handleMenuNavigation("jobs")}>
                    <p className={`text-md ${activeMenu === "jobs" ? "font-semibold" : ""}`}>Jobs</p>
                </div>
                <div className="my-2 py-2 hover:cursor-pointer" onClick={() => handleMenuNavigation("reports")}>
                    <p className={`text-md ${activeMenu === "reports" ? "font-semibold" : ""}`}>Reports</p>
                </div>
                <div className="my-2 py-2 hover:cursor-pointer" onClick={() => handleMenuNavigation("admin")}>
                    <p className={`text-md ${activeMenu === "admin" ? "font-semibold" : ""}`}>Admin</p>
                </div>
            </div>
        </div>
    )
}