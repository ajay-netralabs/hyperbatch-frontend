

interface props {
    variant? : string, // button variant based on theme [primary,secondary,accent etc]
    outline? : string, // outlined button
    size? : string, // button size,
    styleClasses? : string,
    clickFn: any,
    children: React.ReactNode,
    title : string
}

export const Button = ({ variant="", outline, size="md" , styleClasses, clickFn ,children, title="" }: props) => {
    return (
        <button title={title} className={`btn btn-${variant} btn-${outline} btn-${size} ${styleClasses}`} onClick={clickFn}>{children}</button>
    )
}