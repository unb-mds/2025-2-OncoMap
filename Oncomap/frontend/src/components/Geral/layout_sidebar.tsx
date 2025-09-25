import { Outlet } from "react-router-dom";
import Sidebar from "../MapaPage/sidebar";

const Layout = () => {
    return (    
        <div>
            <Sidebar />
            <main style={{ marginLeft: '60px'}}>
                <Outlet />
            </main>
        </div>
    );
}
export default Layout;