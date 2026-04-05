import type { FunctionComponent } from "react";
import s from "./Header.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";

interface HeaderProps {
    children?: React.ReactNode;
    logoSize?: { width: number; height: number };
    isLogin?: boolean;
}

export const Header: FunctionComponent<HeaderProps> = ({
    children,
    logoSize,
    isLogin,
}) => {
    return (
        <div className={`${s.wrapper} ${isLogin ? s.login : ""}`}>
            <BTXIcon
                className={s.icon}
                style={{
                    height: logoSize ? logoSize.height : "",
                    width: logoSize ? logoSize.width : "",
                }}
            />
            {children}
        </div>
    );
};
