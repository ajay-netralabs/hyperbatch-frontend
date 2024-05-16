import { useState } from "react"
import { Button, InputText } from "../../components/form"
import { Link, useNavigate } from "react-router-dom"
import { SidePanel } from "./SidePanel"
import { loginUser } from "./authServices"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/user.slice"

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
       
    }

    return (
        <div className="flex h-screen">
            <div className="w-[50%] h-full">
                <SidePanel />
            </div>
            <div className="w-[50%] flex flex-col justify-center items-center gap-4 mx-auto">

            {
                    loading ? (
                        <div className="h-screen mt-2 flex flex-col justify-center items-center">
                            <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin"/>
                            <p className="mt-2">Logging you in</p>
                        </div>
                    ): (
                        <>
                        <p className="font-semibold text-lg">Get Started</p>
                        <div className="flex flex-col w-[70%]">
                            <InputText label="Email" value={cred.email} changeFn={(e:any) => handleInputChange(e,"email")}/>
                            <InputText type="password" label="Password" value={cred.password} changeFn={(e:any) => handleInputChange(e,"password")}/>
                        </div>
                        <Button clickFn={handleLogin} styleClasses="btn-primary px-4">Sign in</Button>
                        <div className="flex flex-col items-center">
                            <div className="flex"><p>Dont have an account?</p><Link className="ml-2 underline hover:text-primary" to="/signup">Sign up</Link></div>
                            {/* <p>or</p>
                            <div className="flex"><p>Forgot your password?</p><Link className="ml-2 underline hover:text-primary" to="/">Reset</Link></div> */}
                        </div>
                        </>
                    ) }

            </div>   
        </div>
    )
}