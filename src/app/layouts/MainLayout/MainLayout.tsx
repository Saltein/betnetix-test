import { Outlet } from "react-router-dom";
import s from "./MainLayout.module.scss";
import sm from "./MainLayoutMobile.module.scss";
import { Header, NavPanel, ProfileWidget } from "../../../widgets";
import { useGetCurrentUserQuery } from "../../api/auth/authSliceApi";
import Cookies from "js-cookie";
import { useMediaQuery } from "react-responsive";

export const MainLayout = () => {
    useGetCurrentUserQuery(undefined, {
        skip: !Cookies.get("accessToken"),
    });

    const isMobile = useMediaQuery({ maxWidth: 768 });

    if (isMobile) {
        return (
            <div className={sm.wrapper}>
                <Header logoSize={{ width: 74, height: 18.5 }}>
                    <ProfileWidget isMobile={isMobile} />
                </Header>
            
                <Outlet />
            </div>
        );
    }

    return (
        <div className={s.wrapper}>
            <NavPanel />

            <div
                style={{
                    display: "flex",
                    flex: 1,
                    padding: "20px",
                    minWidth: 0,
                    height: "100%",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};
