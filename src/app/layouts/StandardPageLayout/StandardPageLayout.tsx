import type { FunctionComponent } from "react";
import s from "./StandardPageLayout.module.scss";
import { DropDownInput, SearchInput } from "../../../shared";
import { useMediaQuery } from "react-responsive";
import { BodyMobile } from "../../../widgets";
import type { SortDirection } from "../../../shared/types";
import type { Column } from "../../../shared/ui/DataTable/DataTable";

interface StandardPageLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;

    searchQuery: string;
    setSearchQuery: (value: string) => void;

    sortConfig?: {
        key: string;
        direction: SortDirection;
    } | null;
    onSortChange?: (config: { key: string; direction: SortDirection }) => void;

    columns?: Column[];
}

export const StandardPageLayout: FunctionComponent<StandardPageLayoutProps> = ({
    title,
    subtitle,
    children,
    searchQuery,
    setSearchQuery,
    sortConfig,
    onSortChange,
    columns,
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

                {isMobile && onSortChange && (
                    <DropDownInput
                        label="Сортировать по"
                        items={columns!}
                        onChange={onSortChange}
                        sortConfig={sortConfig!}
                        isMobile={isMobile}
                    />
                )}
            </div>

            {isMobile ? (
                <BodyMobile>{children}</BodyMobile>
            ) : (
                <div className={s.body}>{children}</div>
            )}
        </div>
    );
};
