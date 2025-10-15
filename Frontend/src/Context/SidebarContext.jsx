import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

    const location = useLocation();

    const [openSidebar, setOpenSidebar] = useState(() => {
        const saved = sessionStorage.getItem("openSidebar");
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [sidebarActive, setSidebarActive] = useState('');

    useEffect(() => {
        sessionStorage.setItem("openSidebar", JSON.stringify(openSidebar));
    }, [openSidebar]);

    useEffect(() => {

        if(location.pathname.includes("dashboard")) {
            setSidebarActive("dashboard");
        }
        else if(location.pathname.includes("projects")) {
            setSidebarActive("projects");
        }
        else if(location.pathname.includes("calendar")) {
            setSidebarActive("calendar");
        }
        else if(location.pathname.includes("members")) {
            setSidebarActive("members");
        }

    }, [location.pathname])

    return (
        <SidebarContext.Provider value={{openSidebar, setOpenSidebar, sidebarActive, setSidebarActive}}>
            {children}
        </SidebarContext.Provider>
    )

}

export const useSidebar = () => useContext(SidebarContext);