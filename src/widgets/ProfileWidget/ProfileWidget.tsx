import type { FunctionComponent } from "react";
import s from "./ProfileWidget.module.scss";
import { NavButton } from "../../shared";
import LogoutIcon from "../../shared/assets/icons/logout.svg?react";
import UserIcon from "../../shared/assets/icons/users.svg?react";
import Cookies from "js-cookie";
import { useGetCurrentUserQuery } from "../../app/api/auth/authSliceApi";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface ProfileWidgetProps {}

export const ProfileWidget: FunctionComponent<ProfileWidgetProps> = () => {
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

    return (
        <div className={s.wrapper} onClick={handleClickProfile}>
            <div className={s.profile}>
                {isLoading ? (
                    <Skeleton className={s.avatar} style={{backgroundColor: "#FFF"}} />
                ) : image ? (
                    <img
                        src={image?.replace(
                            "dummyjson.com",
                            "test-api.live-server.xyz",
                        )}
                        alt={username}
                        className={s.avatar}
                    />
                ) : (
                    <UserIcon className={s.avatar} style={{ padding: "8px" }} />
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
                                className={s.name}
                            >{`${firstName} ${lastName}`}</div>
                            <div className={s.username}>@{username}</div>
                        </>
                    )}
                </div>
            </div>
            <NavButton
                to={"/login"}
                title={"Выйти"}
                Icon={LogoutIcon}
                alwaysActive
                justifyContent="center"
                onClick={handleLogout}
            />
        </div>
    );
};
