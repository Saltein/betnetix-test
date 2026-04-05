import type { FunctionComponent } from "react";
import s from "./BodyMobile.module.scss";

interface BodyMobileProps {
    children?: React.ReactNode;
    paddings?: boolean;
}

export const BodyMobile: FunctionComponent<BodyMobileProps> = ({
    children,
    paddings,
}) => {
    return (
        <div className={`${s.wrapper} ${paddings ? s.paddings : ""}`}>
            {children}
        </div>
    );
};
