import { useState } from "react"
import { Button, InputText } from "../../components/form"
import { Link, useNavigate } from "react-router-dom"
import { SidePanel } from "./SidePanel"
import { registerUser } from "./authServices"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
            <div className="w-[50%] h-full">
                <SidePanel />
            </div>
            <div className="w-[50%] flex flex-col justify-center items-center gap-4 mx-auto">

                {
                    loading ? (
                        <div className="h-screen mt-2 flex flex-col justify-center items-center">
                            <AiOutlineLoading3Quarters color="#036ca1" fontSize={"50px"} className="animate-spin"/>
                            <p className="mt-2">Creating your account</p>
                        </div>
                    ): (
                        <>
                            <p className="font-semibold text-lg">Create your account</p>
                            <div className="flex flex-col w-[70%]">
                                <InputText label="Name" value={cred.name} changeFn={(e:any) => handleInputChange(e,"name")}/>
                                <InputText label="Email" value={cred.email} changeFn={(e:any) => handleInputChange(e,"email")}/>
                                <InputText type="password" label="Password" value={cred.password} changeFn={(e:any) => handleInputChange(e,"password")}/>
                            </div>
                            <Button clickFn={handleSignup} styleClasses="btn-primary px-4">Sign up</Button>
                            <div className="flex flex-col items-center">
                                <div className="flex"><p>Already have an account?</p><Link className="ml-2 underline hover:text-primary" to="/login">Sign in</Link></div>
                                {/* <p>or</p>
                                <div className="flex"><p>Forgot your password?</p><Link className="ml-2 underline hover:text-primary" to="/reset">Reset</Link></div> */}
                            </div>
                        </>
                    )
                }

            </div>   
        </div>
    )
}