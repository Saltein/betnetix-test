import type { FunctionComponent } from "react";
import s from "./StandardPageLayout.module.scss";
import { SearchInput } from "../../../shared";
import { useMediaQuery } from "react-responsive";
import { BodyMobile } from "../../../widgets";

interface StandardPageLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export const StandardPageLayout: FunctionComponent<StandardPageLayoutProps> = ({
    title,
    subtitle,
    children,
    searchQuery,
    setSearchQuery,
}) => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (
        <div className={`${s.wrapper} ${isMobile ? s.mobile : ""}`}>
            <div className={`${s.headerWrapper} ${isMobile ? s.mobile : ""}`}>
                <div className={`${s.header} ${isMobile ? s.mobile : ""}`}>
                    <h1>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>

                <SearchInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isMobile={isMobile}
                    placeholder="Поиск по публикациям"
                />
            </div>

            {isMobile ? (
                <BodyMobile>{children}</BodyMobile>
            ) : (
                <div className={s.body}>{children}</div>
            )}
        </div>
    );
};
