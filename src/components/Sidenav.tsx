import { MdSpaceDashboard } from "react-icons/md";
import { FaHatWizard } from "react-icons/fa";
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

// const wizardSubmenu = [
//     {
//         icon : FaHatWizard,
//         name : "Home"
//     },
//     {
//         icon : FaHatWizard,
//         name : "Create"
//     }
// ]

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

// interface sm{
//     [key: string]: submenu;
// }

// type submenukey = "wizard" | "dashboard" | "none"

// const SUBMENU: {[key in submenukey]: submenu[]} = {
//     wizard : [{
//         icon : FaHatWizard,
//         name : "Home"
//     },
//     {
//         icon : FaHatWizard,
//         name : "Create"
//     }
//     ],
//     dashboard: [
//         {
//             icon : FaHatWizard,
//             name : "Home"
//         }
//     ],
//     none: []
// } 


interface submenu {
    icon: any,
    name: string
}


export const SideNav = () => {
    const navigate = useNavigate()
    const open = useSelector((state: any) => state.sidebar.open)

    const [hover, sethover] = useState("")

    const [activeMenu, setActiveMenu] = useState("")

    const [activeSubmenu, setActiveSubmenu] = useState("")

    const [openMenu, setOpenMenu] = useState<any[]>([])

    const calculateOpenMenu = (name:any) => {
      if(openMenu.includes(name)){
        setOpenMenu(state => {
            return state.filter(menu => menu !== name)
        })
      }else{
        setOpenMenu(state => {
            return [...state, name]
        })
      }

      setActiveMenu(name)
      if(name === "dashboard"){
        navigate("/")
      }
    }

    
    const links:any = {
        dasboard : "/",
        settings : "/settings",
        performance : "/performane"
    }

    // const setHoverItem = (name:string) => {
    //     setActiveMenu(name)
    //     setActiveSubmenu(name)

    //     if(links[name]){
    //         navigate(links[name])
    //     }
    // }

    const sublist:any = {
        "Projects" : "/projects",
        "Create Project" : "/projects/create",
        "Jobs": "/jobs",
        "Create Job" : "/jobs/create",
        "Variables": "/variables",
        "Create Variable" : "/variables/create"
    }

    const navigateSubmenu = (name: string) => {
        const link = sublist[name]
        if(link){
            setActiveSubmenu(name)
            navigate(link)
        }
    }

    return (
        <div className={`sidenav font-medium shadow-md bg-base-100 flex flex-col w-[12%] h-full pt-4 ${open ? "open" : ""}`}>
            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => calculateOpenMenu("dashboard")}>
                <MdSpaceDashboard color={`${activeMenu === "dashboard" ? "#036da1" : "black" }`} fontSize="16px" />
                <span className="ml-2 font-semibold text-xs">Dashboard</span>
            </div>
            {/* <div className="divider mt-0 mb-0"></div>  */}
            <hr />
            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "projects" ? "active" : ""}`} onClick={() => calculateOpenMenu("projects")}>
                <FiLayers color={`${hover === "projects" ? "#036da1" : "black" }`} fontSize="16px"/>
                <span className="ml-2  font-semibold text-xs">Projects</span>
            </div>
            {openMenu.includes("projects") ? (
                projectSubmenu.map((menu, key)=> (
                    <div key={key}>
                    <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name) } isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
                    <hr />
                    </div>
                ))
            ) : null}

            <hr />
            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "jobs" ? "active" : ""}`} onClick={() => calculateOpenMenu("jobs")}>
                <MdOutlineDocumentScanner color={`${activeMenu === "jobs" ? "#036da1" : "black" }`} fontSize="16px"/>
                <span className="ml-2  font-semibold text-xs">Jobs</span>
            </div>

            {openMenu.includes("jobs") ? (
                jobSubmenu.map((menu, key) => (
                    <div key={key}>
                    <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name)} isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
                    <hr />
                    </div>
                ))
            ) : null}


            <hr /> 

            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "variables" ? "active" : ""}`} onClick={() => calculateOpenMenu("variables")}>
                <FaBoxArchive  color={`${activeMenu === "variables" ? "#036da1" : "black" }`} fontSize="16px"/>
                <span className="ml-2  font-semibold text-xs">Variables</span>
            </div>

            {openMenu.includes("variables") ? (
                variableSubmenu.map((menu, key) => (
                    <div key={key}>
                        <Submenu key={key} item={menu} clickFn={() => navigateSubmenu(menu.name)} isActive={activeSubmenu === menu.name} styleClass={`${activeSubmenu === menu.name ? "active" : ""}`}/>
                        <hr />
                    </div>
                ))
            ) : null}

            <hr />

            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "performance" ? "active" : ""}`} onClick={() => calculateOpenMenu("performance")}>
                <CgPerformance color={`${activeMenu === "performance" ? "#036da1" : "black" }`} fontSize="16px"/>
                <span className="ml-2  font-semibold text-xs">Performance</span>
            </div>

            <hr />
            <div className={`menu-item flex items-center px-5 py-5 hover:cursor-pointer ${activeMenu === "settings" ? "active" : ""}`} onClick={() => calculateOpenMenu("settings")}>
                <IoSettingsOutline color={`${activeMenu === "settings" ? "#036da1" : "black" }`} fontSize="16px"/>
                <span className="ml-2  font-semibold text-xs">Settings</span>
            </div>
            
            {/* <div className="relative"> */}
                 {/* <Submenu list={activeSubmenu} open={hover !== "none"}/> */}
            {/* </div> */}
            <hr />
        </div>
    )
}