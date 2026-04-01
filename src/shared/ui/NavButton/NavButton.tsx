import { Button } from "@heroui/react";
import type { FunctionComponent } from "react";
import s from "./NavButton.module.scss";
import { useNavigate } from "react-router-dom";

interface NavButtonProps {
    to: string;
    title: string;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    currentLocation: string;
}

export const NavButton: FunctionComponent<NavButtonProps> = ({
    to,
    title,
    Icon,
    currentLocation,
}) => {
    const navigate = useNavigate();

    return (
        <Button
            className={`${s.button} ${currentLocation === to ? s.active : ""}`}
            onClick={() => navigate(to)}
        >
            {Icon && <Icon className={s.icon} />}
            {title}
        </Button>
    );
};
