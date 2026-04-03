import type { FunctionComponent } from "react";
import s from "./StandardPageLayout.module.scss";

interface StandardPageLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const StandardPageLayout: FunctionComponent<StandardPageLayoutProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
            </div>
            
            <div className={s.body}>{children}</div>
        </div>
    );
};
