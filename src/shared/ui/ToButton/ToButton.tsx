import { Button } from "@heroui/react";
import type { FunctionComponent } from "react";
import RightIcon from "../../../shared/assets/icons/rightCircle.svg?react";
import s from "./ToButton.module.scss";
import { useNavigate } from "react-router-dom";

export interface ToButtonProps {
    to: string;
    id?: string;
}

export const ToButton: FunctionComponent<ToButtonProps> = ({ to, id }) => {
    const navigate = useNavigate();
    return (
        <Button
            className={s.button}
            onClick={() => navigate(id ? to + `/${id}` : to)}
        >
            <RightIcon className={s.icon} />
        </Button>
    );
};
