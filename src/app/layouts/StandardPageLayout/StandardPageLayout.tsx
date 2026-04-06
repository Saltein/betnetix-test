import type { FunctionComponent } from "react";
import s from "./StandardPageLayout.module.scss";
import { DropDownInput, SearchInput } from "../../../shared";
import { useMediaQuery } from "react-responsive";
import { BodyMobile } from "../../../widgets";
import type { SortDirection } from "../../../shared/types";
import type { Column } from "../../../shared/ui/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../../shared/assets/icons/leftArrow.svg?react";

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

    backButtonLabel?: string;
    backButtonLink?: string;

    searchPlaceholder?: string;
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
    backButtonLabel,
    backButtonLink,
    searchPlaceholder,
}) => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const navigate = useNavigate();

    return (
        <div className={`${s.wrapper} ${isMobile ? s.mobile : ""}`}>
            <div className={`${s.headerWrapper} ${isMobile ? s.mobile : ""}`}>
                {backButtonLabel && (
                    <div
                        onClick={() => {
                            navigate(backButtonLink || "/");
                        }}
                        className={`${s.backButton} ${isMobile ? s.mobile : ""}`}
                    >
                        <LeftArrow />
                        {backButtonLabel}
                    </div>
                )}

                <div className={`${s.header} ${isMobile ? s.mobile : ""}`}>
                    <h1>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>

                <SearchInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isMobile={isMobile}
                    placeholder={searchPlaceholder || "Поиск"}
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
