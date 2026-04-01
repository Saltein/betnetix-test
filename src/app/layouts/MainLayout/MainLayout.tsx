import { Outlet } from "react-router-dom";
import s from "./MainLayout.module.scss";
import { NavPanel } from "../../../widgets";

export const MainLayout = () => {
    return (
        <div className={s.wrapper}>
            <NavPanel />

            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
};
