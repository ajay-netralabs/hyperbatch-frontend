interface props {
    options : any[],
    placeholder: string,
    styleClass?: string,
    value?: any,
    disabled?:boolean,
    changeFn: any
}

export const Select = ({options, placeholder, styleClass, changeFn, value, disabled}: props) => {
  return ( <select disabled={disabled} className={`select select-sm select-bordered w-full !text-xs ${styleClass}`} onChange={changeFn} value={value}>
        <option disabled selected>{placeholder}</option>
        {options.map((item:any, key) => (
            <option key={key} value={item.value}>{item.label}</option>
        ))}
    </select>
  )
}