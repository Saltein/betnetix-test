import { Button } from "@heroui/react";
import type { FunctionComponent } from "react";
import RightIcon from "../../../shared/assets/icons/rightCircle.svg?react";
import RightIconMobile from "../../../shared/assets/icons/rightCircleMobile.svg?react";
import s from "./ToButton.module.scss";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export interface ToButtonProps {
    to: string;
    id?: string;
}

export const ToButton: FunctionComponent<ToButtonProps> = ({ to, id }) => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const navigate = useNavigate();
    return (
        <Button
            className={`${s.button} ${s.mobile}`}
            onClick={() => navigate(id ? to + `/${id}` : to)}
        >
            {isMobile ? (
                <RightIconMobile className={`${s.icon} ${s.mobile}`} />
            ) : (
                <RightIcon className={s.icon} />
            )}
        </Button>
    );
};
