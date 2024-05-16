

interface props {
    variant? : string, // button variant based on theme [primary,secondary,accent etc]
    outline? : string, // outlined button
    size? : string, // button size,
    styleClasses? : string,
    clickFn: any,
    children: React.ReactNode
}

export const Button = ({ variant="", outline, size="md" , styleClasses, clickFn ,children }: props) => {
    return (
        <button className={`btn btn-${variant} btn-${outline} btn-${size} ${styleClasses}`} onClick={clickFn}>{children}</button>
    )
}