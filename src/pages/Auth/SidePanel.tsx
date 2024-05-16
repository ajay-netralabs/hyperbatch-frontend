import "./side-panel.css"

export const SidePanel = () => {
    return (
        <div className="bg-slate-200 h-full flex flex-col items-center justify-center">
            {/* <div> */}
                {/* <p className="text-3xl font-bold ml-5">Hyper batch</p>
                <p className="text-xl ml-5"></p> */}
                <div className="sidebar-overlay flex justify-center items-center">
                    <p className="text-3xl font-bold ml-5 text-white">Hyperbatch</p>
                </div>
                <video
                    src="/yantra-bg.webm"
                    autoPlay={true}
                    muted
                    playsInline
                    loop
                    className="sidebar-vdo"
                />
            {/* </div> */}
        </div>
    )
}