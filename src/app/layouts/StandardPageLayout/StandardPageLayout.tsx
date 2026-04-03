import type { FunctionComponent } from "react";
import s from "./StandardPageLayout.module.scss";
import { SearchInput } from "../../../shared";

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
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
            </div>

            <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isMobile={false}
                placeholder="Поиск по публикациям"
            />

            <div className={s.body}>{children}</div>
        </div>
    );
};
