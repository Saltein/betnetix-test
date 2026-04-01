import type { FunctionComponent } from "react";
import s from "./NavList.module.scss";
import { NavButton } from "../../../shared";
import PostsIcon from "../../../shared/assets/icons/posts.svg?react";
import AdminsIcon from "../../../shared/assets/icons/admins.svg?react";
import UsersIcon from "../../../shared/assets/icons/users.svg?react";
import { useLocation } from "react-router-dom";

interface NavListProps {}

export const NavList: FunctionComponent<NavListProps> = () => {
    const location = useLocation();
    const currentLocation = location.pathname;

    return (
        <div className={s.wrapper}>
            <NavButton
                to="/posts"
                title="Публикации"
                currentLocation={currentLocation}
                Icon={PostsIcon}
            />
            <NavButton
                to="/admins"
                title="Администраторы"
                currentLocation={currentLocation}
                Icon={AdminsIcon}
            />
            <NavButton
                to="/users"
                title="Пользователи"
                currentLocation={currentLocation}
                Icon={UsersIcon}
            />
        </div>
    );
};
