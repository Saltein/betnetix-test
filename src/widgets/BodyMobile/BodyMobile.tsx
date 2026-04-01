import type { FunctionComponent } from "react";
import s from "./BodyMobile.module.scss";

interface BodyMobileProps {
    children?: React.ReactNode;
}

export const BodyMobile: FunctionComponent<BodyMobileProps> = ({
    children,
}) => {
    return <div className={s.wrapper}>{children}</div>;
};
