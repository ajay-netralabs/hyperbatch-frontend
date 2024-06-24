import { useDispatch } from "react-redux"
import { toggleSidebar } from "../store/slices/sidebar.slice"
import { FaRegUser } from "react-icons/fa";
import "./navbar.css"
import Cookies from 'universal-cookie';
import { logoutUser } from "../store/slices/user.slice";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {

    const cookies = new Cookies(null, { path: '/' });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleSideBar = () => {
        dispatch(toggleSidebar())
    }

    const handleLogoutUser = () => {
        // remove user from redux
        // delete cookie
        // navigate user out to login
        cookies.remove("session_id");
        dispatch(logoutUser())
        navigate("/login")
        navigate(0)
    }

    return (
        <div className="navbar bg-[#B9D9EB] shadow-md z-40">
            {/* <div className="flex-none">
                <button className="btn btn-square btn-ghost" onClick={toggleSideBar}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
             </button>
            </div> */}
            <div className="flex-1">
                <p className="logo-text text-2xl font-semibold text-accent hover:cursor-pointer" onClick={toggleSideBar}>JOSEPH.AI</p>
                <p className="ml-2 italic text-sm">powered by Netra Labs</p>
            </div>
            {/* <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button>
            </div> */}

            <div className="flex-none gap-2">
                <div className="flex flex-col items-end text-sm">
                    <p>ABC Enterprises (ABCD-1234)</p>
                    <p>Booth, Robert (UN-564545)</p>
                    <p>License: UL-ABCD-09876</p>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <FaRegUser fontSize={"28px"} />
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 w-52">
                        <li onClick={handleLogoutUser}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
)}