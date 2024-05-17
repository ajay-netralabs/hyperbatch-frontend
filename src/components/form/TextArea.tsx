
interface props {
    value : string,
    changeFn : any,
    label? : string,
    placeholder : string,
    styleClass?: string,
    disabled?: boolean
}

export const TextArea = ({label, value, changeFn, placeholder, styleClass, disabled = false} : props) => {
    return (
        <label className="form-control w-full">
            {label ? (
            <div className="label">
                <span className="label-text">{label}</span>
             </div>

            ) : null}
            <textarea  disabled={disabled} value={value} placeholder={placeholder} className={`textarea textarea-bordered textarea-lg w-full resize-none px-[1rem] text-xs ${styleClass}`} onChange={changeFn} ></textarea>
        </label>
    )
}