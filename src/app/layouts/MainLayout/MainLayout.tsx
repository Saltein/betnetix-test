import { Outlet } from "react-router-dom";
import s from "./MainLayout.module.scss";
import { NavPanel } from "../../../widgets";
import { useGetCurrentUserQuery } from "../../api/auth/authSliceApi";
import Cookies from "js-cookie";

export const MainLayout = () => {
    useGetCurrentUserQuery(undefined, {
        skip: !Cookies.get("accessToken"),
    });

    return (
        <div className={s.wrapper}>
            <NavPanel />

            <div style={{display: "flex", flex: 1, padding: "20px", minWidth: 0, height: "100%" }}>
                <Outlet />
            </div>
        </div>
    );
};
