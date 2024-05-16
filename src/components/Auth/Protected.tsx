import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';


interface ProtectedProps {
    children: React.ReactNode;
  }

  export const Protected: React.FC<ProtectedProps> = ({ children }) => {

    const cookies = new Cookies(null, { path: '/' });

    const navigate = useNavigate()
    const user = useSelector((state:any) => state.user.user)
    const cookie = cookies.get("session_id")

    useEffect(() => {

        if(!user && !cookie){
            navigate("/login")
        }

    // no dependencies needed here, this component is supposed to run on every page
    })

    return (
        <>
            {user || cookie ? (
                <div>
                    {children}
                </div>
            ) : null}
        </>
    )
  }