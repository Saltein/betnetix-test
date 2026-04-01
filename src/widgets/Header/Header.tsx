import type { FunctionComponent } from "react";
import s from "./Header.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";

interface HeaderProps {}

export const Header: FunctionComponent<HeaderProps> = () => {
    return (
        <div className={s.wrapper}>
            <BTXIcon className={s.icon} />
        </div>
    );
};
