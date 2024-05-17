// import { TextInput } from '@mantine/core';
// import classes from "./input-tex.module.css"


interface props {
    type?: string,
    value : string,
    changeFn : any,
    label? : string,
    placeholder? : string,
    styleClass?: string,
    disabled?: boolean,
    labelClass?: string,
}

export const InputText = ({type = "text",value, changeFn, label, placeholder, styleClass, disabled = false, labelClass} : props) => {
    return (
        // <TextInput 
        //     label={label}
        //     placeholder={placeholder}
        //     required
        //     classNames={classes}
        //     value={value}
        //     onChange={changeFn}
        //     mt="md"
        //     autoComplete="nope"
        //     data-floating={false}
        //     labelProps={{ 'data-floating': false }}
        //     className={styleClass}
        // />
        
        <label className="form-control w-full">
            {label ? (
             <div className="label">
                <span className={`label-text ${labelClass}`}>{label}</span>
            </div>
            ) : null}
            <input disabled={disabled} type={type} placeholder={placeholder} className={`input input-bordered w-full !text-xs ${styleClass}`} value={value} onChange={changeFn}/>
        </label>
    )
}