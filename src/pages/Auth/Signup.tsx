import { useState } from "react"
import { Button, InputText } from "../../components/form"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "./authServices"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import COBOLPROGRAM from "/cobol-programming.jpg"

export const Signup = () => {

    const navigate = useNavigate()

    const [cred, setCred] = useState({
        name: "",
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

    const handleSignup = async () => {
        const { name, email, password } = cred

        if(!name){
            toast("Please enter your name")
            return
        }

        if(!email){
            toast("Please enter your email")
        }

        if(!password){
            toast("Please enter your password")
        }

        setLoading(true)
        const res = await registerUser(cred.name, cred.email, cred.password)
        const jsonResp = await res?.json()

        if(jsonResp.error){
            toast(jsonResp.message)
            setLoading(false)
            return
        }

        toast("Account created sucessfully, please login")
        setLoading(false)
        navigate("/login")

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
                                <p className="mt-2 text-white">Creating your account</p>
                            </div>
                        ): (
                            <>
                                <div className="flex flex-col w-[70%]">
                                    <InputText labelClass="text-white" label="Name" value={cred.name} changeFn={(e:any) => handleInputChange(e,"name")}/>
                                    <InputText labelClass="text-white" label="Email" value={cred.email} changeFn={(e:any) => handleInputChange(e,"email")}/>
                                    <InputText labelClass="text-white" type="password" label="Password" value={cred.password} changeFn={(e:any) => handleInputChange(e,"password")}/>
                                </div>
                                <Button clickFn={handleSignup} styleClasses="btn-primary px-4">Sign up</Button>
                                <div className="flex flex-col items-center">
                                    <div className="flex text-white"><p>Already have an account?</p><Link className="ml-2 underline hover:text-primary" to="/login">Sign in</Link></div>
                                    {/* <p>or</p>
                                    <div className="flex"><p>Forgot your password?</p><Link className="ml-2 underline hover:text-primary" to="/reset">Reset</Link></div> */}
                                </div>
                            </>
                        )
                    }

                </div>
            </div> 
        </div>
    )
}