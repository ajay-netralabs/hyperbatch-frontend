/**
 * list {
 *      icon : component,
 *      text : text
 *  }
 */

import { useState } from "react"
import "./sidenav.css"

interface props {
    item: any,
    clickFn: any,
    isActive: boolean,
    styleClass? : string,
    optionkey?: any
}

export const Submenu = ({item, clickFn, styleClass,isActive, optionkey}:props) => {

    // const [isHovering , setHover] = useState(false)

    // const sethover = (value = false) => {
    //     setHover(value)
    // }

    //  <div className={`submenu flex flex-col bg-base-200 h-full w-[15%] ${open || isHovering ? "submenu-open" : ""}`} onMouseOver={() => sethover(true)} onMouseLeave={() => sethover(false)} >
    return (
                    <div key={optionkey} className={`submenu-item flex gap-4 items-center pl-[20%] py-3 ${styleClass}`} onClick={clickFn}>
                        {<item.icon fontSize="12px" color={`${isActive} ? "#036da1" : ""}`}/>}
                        <p className="font-semibold text-xs">{item.name}</p>
                    </div>
    )
}