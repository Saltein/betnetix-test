import { Outlet } from "react-router-dom";
// import { Navbar } from "../widgets/Navbar";
import s from "./MainLayout.module.scss";

export const MainLayout = () => {
    return (
        <div className={s.wrapper}>
            {/* <Navbar /> */}
            <nav>nav</nav>

            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
};
