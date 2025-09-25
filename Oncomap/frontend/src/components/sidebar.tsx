import { useState } from "react";

const Sidebar = () =>{
    const [menuOpen, setmenuOpen] = useState(false);
     return(
        <div className="sidebar">
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre</a>
            <a href="#quem-somos">Quem Somos</a>
        </div>
    )
}   
export default Sidebar;