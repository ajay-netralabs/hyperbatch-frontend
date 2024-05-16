import "../Projects/project.css"
import { FaPlus } from "react-icons/fa6";
import { Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
// @ts-ignore
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { deleteData, getAllVariables } from "../../services/ApiServices";
import { deleteVariable, addVariable } from "../../store/slices/variables.slice";
import Cookies from 'universal-cookie';

export const VariableHome = () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get("session_id")
    const navigate = useNavigate();
    const open = useSelector((state: any) => state.sidebar.open);
    const variables = useSelector((state : any) => state.variables.variables)
    const dispatch = useDispatch(); 
    const [loading, setLoading] = useState(false)
// @ts-ignore
    const fetchVariables = async () => {
        try {
            setLoading(true)
            const AllVariables = await getAllVariables(token); 
            if (Array.isArray(AllVariables)) {
                dispatch(addVariable(AllVariables));
            } else {
                toast.error(AllVariables.message || "Unexpected error occurred.");
            }
            setLoading(false)
        } catch (error) {
            toast.error("Unexpected Error, please contact support.")
            console.error('Error fetching projects:', error);
            setLoading(false)
        }
    };

    useEffect(() => {
        if(!variables.length) fetchVariables();
     }, []);

    const handleDeleteVariable = async (var_id: string) => {
        try {
            const ids: string[] = [];
            ids.push(var_id);
            setLoading(true)
            const res = await deleteData(ids, "variables", token);
            if (res && res.ok) {
                const result = await res.json();
                if (result.error === true) {
                    toast.error(result.message);
                } else {
                    dispatch(deleteVariable({var_id}))
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

    return (
        <div className={`project-container ${open ? "sidenav-open" : ""}`}>
            <div className="w-full flex flex-col justify-center item-center mx-auto" >
                <div className="flex justify-between">
                    <h1 className="top-heading"></h1>
                    <button
                        className="btn btn-primary ml-10 !text-xs"
                    onClick={() => navigate("/variables/create")}
                    >
                        <FaPlus size={14} className="" />
                        <b>Create Variable</b>
                    </button>
                </div>

                <div className="table-holder">
                    <div className="table">
                        <div className="table-heading">
                           
                            <div style={{ width: "25%" }}>Variable Name</div>
                            <div style={{ width: "25%" }}>
                            Variable Description
                            </div>
                            

                            <div style={{ width: "20%" }}>
                                Date Created
                            </div>
                            <div style={{ width:"5%" }} className="text-center">
                                Actions
                            </div>
                        </div>


                        {loading ? (
                            <div className="table-body">
                            <div className="h-[50vh] mt-2 flex justify-around items-center">
                                <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin"/>
                            </div>
                        </div>
                        ) : (
                        <div className="table-body">
                            {variables.length ? variables.map((item : any) => (
                                <div className="table-data" key={item.var_id}>
                                   
                                    <div
                                        style={{ width: "25%" , color: "#1f78a5"}} className="font-semibold hover:cursor-pointer" 
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
                                                <HiOutlineDotsHorizontal />
                                            </div>
                                            </Menu.Target>
                                            <Menu.Dropdown  className="prompt-dropdown">
                                                <Menu.Item className="prompt-dropdown-item border-top" onClick={() => handleDeleteVariable(item.var_id)}>
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                            </Menu>
                                </div>



                            )) : (
                                <div className="h-[50vh] mt-2 flex justify-around items-center">
                                    <p className="text-lg">You don't have any variables</p>
                                </div>  
                            )}
                        </div>

                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}