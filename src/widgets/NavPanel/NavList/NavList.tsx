import type { FunctionComponent } from "react";
import s from "./NavList.module.scss";
import { NavButton } from "../../../shared";
import PostsIcon from "../../../shared/assets/icons/posts.svg?react";
import AdminsIcon from "../../../shared/assets/icons/admins.svg?react";
import UsersIcon from "../../../shared/assets/icons/users.svg?react";
import { useLocation } from "react-router-dom";

interface NavListProps {
    isMobile?: boolean;
}

export const NavList: FunctionComponent<NavListProps> = ({ isMobile }) => {
    const location = useLocation();
    const currentLocation = location.pathname;

    return (
        <div className={`${s.wrapper} ${isMobile ? s.mobile : ""}`}>
            <NavButton
                to="/posts"
                title="Публикации"
                currentLocation={currentLocation}
                Icon={PostsIcon}
                isMobile={isMobile}
            />
            <NavButton
                to="/admins"
                title="Администраторы"
                currentLocation={currentLocation}
                Icon={AdminsIcon}
                isMobile={isMobile}
            />
            <NavButton
                to="/users"
                title="Пользователи"
                currentLocation={currentLocation}
                Icon={UsersIcon}
                isMobile={isMobile}
            />
        </div>
    );
};
