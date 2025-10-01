import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
import BottomNav from "@/ui/BottomNav";

function BottomNavPortal() {
    return createPortal(<BottomNav />, document.body);
}

export default function Chrome() {
    useEffect(() => {
        document.body.classList.add("with-bottomnav", "with-topnav");
        return () => {
            document.body.classList.remove("with-bottomnav", "with-topnav");
        };
    }, []);

    return (
        <>
            <Outlet />
            <BottomNavPortal />
        </>
    );
}
