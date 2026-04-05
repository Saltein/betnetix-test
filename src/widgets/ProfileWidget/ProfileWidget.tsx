import type { FunctionComponent } from "react";
import s from "./ProfileWidget.module.scss";
import { NavButton } from "../../shared";
import LogoutIcon from "../../shared/assets/icons/logout.svg?react";
import UserIcon from "../../shared/assets/icons/users.svg?react";
import Cookies from "js-cookie";
import { useGetCurrentUserQuery } from "../../app/api/auth/authSliceApi";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface ProfileWidgetProps {
    isMobile?: boolean;
}

export const ProfileWidget: FunctionComponent<ProfileWidgetProps> = ({
    isMobile,
}) => {
    const { data, isLoading, error } = useGetCurrentUserQuery();

    const { firstName, lastName, username, image } = data || {};

    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
    };

    const handleClickProfile = () => {
        navigate("/profile");
    };

    const logoutBtnMobileStyle = {
        height: "32px",
        width: "32px",
        borderRadius: "8px",
    };

    return (
        <div
            className={`${s.wrapper} ${isMobile ? s.mobile : ""}`}
            onClick={handleClickProfile}
        >
            <div className={`${s.profile} ${isMobile ? s.mobile : ""}`}>
                {isLoading ? (
                    <Skeleton
                        className={`${s.avatar} ${isMobile ? s.mobile : ""}`}
                        style={{ backgroundColor: "#FFF" }}
                    />
                ) : image ? (
                    <img
                        src={image?.replace(
                            "dummyjson.com",
                            "test-api.live-server.xyz",
                        )}
                        alt={username}
                        className={`${s.avatar} ${isMobile ? s.mobile : ""}`}
                    />
                ) : (
                    <UserIcon
                        className={`${s.avatar} ${isMobile ? s.mobile : ""}`}
                        style={{ padding: "8px" }}
                    />
                )}
                <div className={s.info}>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-5 w-36 rounded-lg" />
                            <Skeleton className="h-5 w-36 rounded-lg" />
                        </>
                    ) : (
                        <>
                            <div
                                className={`${s.name} ${isMobile ? s.mobile : ""}`}
                            >{`${firstName} ${lastName}`}</div>
                            <div
                                className={`${s.username} ${isMobile ? s.mobile : ""}`}
                            >
                                @{username}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <NavButton
                to={"/login"}
                title={isMobile ? "" : "Выйти"}
                Icon={LogoutIcon}
                alwaysActive
                justifyContent="center"
                onClick={handleLogout}
                style={isMobile ? logoutBtnMobileStyle : {}}
            />
        </div>
    );
};
