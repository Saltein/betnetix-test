import { Outlet } from "react-router-dom";
import s from "./MainLayout.module.scss";
import { NavPanel } from "../../../widgets";
import { useGetCurrentUserQuery } from "../../api/authSliceApi";
import Cookies from "js-cookie";

export const MainLayout = () => {
    useGetCurrentUserQuery(undefined, {
        skip: !Cookies.get("accessToken"),
    });
    
    return (
        <div className={s.wrapper}>
            <NavPanel />

            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
};
