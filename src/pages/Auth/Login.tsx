import { useState } from "react"
import { Button, InputText } from "../../components/form"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "./authServices"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/user.slice"

import COBOLPROGRAM from "/cobol-programming.jpg"
import "./side-panel.css"

export const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [cred, setCred] = useState({
        email : "",
        password: ""
    })

    const [loading, setLoading] = useState(false)

    const handleInputChange = (e:any, name: string) => {
        const { value } = e.target
        
        setCred(state => {
            return {
                ...state,
                [name] : value
            }
        })
    }

    const handleLogin = async () => {
        setLoading(true)
       
        try{
            const res:any = await loginUser(cred.email, cred.password)
            const jsonResp = await res.json()
    
            if(jsonResp.error){
                toast(jsonResp.message)
                setLoading(false)
                return
            }
    
            const {token} = jsonResp
            document.cookie = token
    
            toast("Logged in successfully")
            dispatch(login({id: jsonResp.message, email: cred.email}))
            setLoading(false)
            // add user to redux store
            navigate("/")
            
        }catch(err:any){
            toast(err.message || "Couldn't logged you in")
        }
       
    }

    return (
        <div className="flex h-screen">
        <div className="relative h-screen w-screen">
            <div className="sidebar-overlay"></div>
            <img className="h-screen w-screen" src={COBOLPROGRAM} />
            <div className="auth-container w-[50%] z-10 flex flex-col justify-center items-center gap-4 mx-auto py-5">

            {
                    loading ? (
                        <div className="flex flex-col justify-center items-center">
                            <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin"/>
                            <p className="mt-2 text-white">Logging you in</p>
                        </div>
                    ): (
                        <>
                        
                        <div className="flex flex-col w-[70%]">
                            <InputText label="Email" value={cred.email} labelClass="text-white" changeFn={(e:any) => handleInputChange(e,"email")}/>
                            <InputText type="password" label="Password" labelClass="text-white" value={cred.password} changeFn={(e:any) => handleInputChange(e,"password")}/>
                        </div>
                        <Button clickFn={handleLogin} styleClasses="btn-primary px-4">Sign in</Button>
                        <div className="flex flex-col items-center">
                            <div className="flex text-white"><p>Dont have an account?</p><Link className="ml-2 underline hover:text-primary" to="/signup">Sign up</Link></div>
                            {/* <p>or</p>
                            <div className="flex"><p>Forgot your password?</p><Link className="ml-2 underline hover:text-primary" to="/">Reset</Link></div> */}
                        </div>
                        </>
                    ) }

            </div>   
        </div>
    </div>
    )
}