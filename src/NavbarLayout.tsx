import { Outlet } from "react-router-dom";
import { NavBar, SideNav } from "./components";

export default function NavbarLayout () {
    return (
        <div>
            <NavBar />
            <SideNav />
            <div>
                <Outlet />
            </div>
        </div>
    )
}