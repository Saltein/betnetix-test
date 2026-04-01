import type { FunctionComponent } from "react";
import s from "./NavPanel.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";
import { NavList } from "./NavList/NavList";
import { ProfileWidget } from "../.";

interface NavPanelProps {}

export const NavPanel: FunctionComponent<NavPanelProps> = () => {
    return (
        <div className={s.wrapper}>
            <div className={s.logoNavigation}>
                <BTXIcon className={s.logo} />
                <NavList />
            </div>
            <ProfileWidget />
        </div>
    );
};
