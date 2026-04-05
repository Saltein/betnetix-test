import { Button } from "@heroui/react";
import type { FunctionComponent } from "react";
import s from "./NavButton.module.scss";
import { useNavigate } from "react-router-dom";

interface NavButtonProps {
    to: string;
    title: string;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    currentLocation?: string;
    alwaysActive?: boolean;
    justifyContent?: "flex-start" | "flex-end" | "center";
    onClick?: () => void;
    style?: React.CSSProperties;
    isMobile?: boolean;
}

export const NavButton: FunctionComponent<NavButtonProps> = ({
    to,
    title,
    Icon,
    currentLocation,
    alwaysActive = false,
    justifyContent = "flex-start",
    onClick,
    style,
    isMobile,
}) => {
    const navigate = useNavigate();

    return (
        <Button
            style={{ justifyContent: justifyContent, ...style }}
            className={`${s.button} ${isMobile ? s.mobile : ""} ${currentLocation === to || alwaysActive ? s.active : ""}`}
            onClick={() => {
                navigate(to);
                if (onClick) onClick();
            }}
        >
            {Icon && <Icon className={s.icon} />}
            {title}
        </Button>
    );
};
