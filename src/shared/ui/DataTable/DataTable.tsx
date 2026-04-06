import { type FunctionComponent } from "react";
import ChevronLeft from "../../assets/icons/leftChevron.svg?react";
import SortIcon from "../../assets/icons/sort.svg?react";
import OptionIcon from "../../assets/icons/options.svg?react";
import s from "./DataTable.module.scss";
import type { SortDirection } from "../../types";
import { BirthDateCell } from "../../../pages/AdminsPage/BirthDateCell/BirthDateCell";
import { Button } from "@heroui/react";

export interface Column {
    key: string;
    label: string;
    type:
        | "lite"
        | "main"
        | "color"
        | "special"
        | "birthDate"
        | "default"
        | "button"
        | "multiline";
    width?: string;
    align?: "left" | "center" | "right";
    sortable?: boolean;
}

interface TableProps<T> {
    columns: Column[];
    tableData: T[];
    totalCount: number;

    currentPage: number;
    onPageChange: (page: number) => void;

    rowsPerPage: number;
    onRowsPerPageChange: (value: number) => void;

    ActionButton?: FunctionComponent<any>;
    actionButtonProps?: any;
    SpecialCell?: FunctionComponent<any>;
    SpecialCell2?: FunctionComponent<any>;
    specialCellProps?: any;
    specialCellProps2?: any;

    isLoading?: boolean;

    sortConfig?: {
        key: string;
        direction: SortDirection;
    } | null;

    onSortChange?: (config: { key: string; direction: SortDirection }) => void;
}

export const DataTable: FunctionComponent<TableProps<any>> = ({
    columns,
    tableData,
    totalCount,
    currentPage,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    ActionButton,
    actionButtonProps,
    SpecialCell,
    specialCellProps,
    isLoading,
    sortConfig,
    onSortChange,
}) => {
    const handleSort = (key: string) => {
        if (!onSortChange) return;

        if (sortConfig?.key === key) {
            onSortChange({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
            });
        } else {
            onSortChange({ key, direction: "asc" });
        }
    };

    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const getPages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages)
            return [totalPages - 2, totalPages - 1, totalPages];

        return [currentPage - 1, currentPage, currentPage + 1];
    };

    const pagesArray = getPages();

    return (
        <div className={s.wrapper}>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead className={s.tableHead}>
                        <tr className={s.tableHeadRow}>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => {
                                        if (column.sortable)
                                            handleSort(column.key);
                                    }}
                                    className={s.tableHeadCell}
                                    style={{ width: column.width }}
                                >
                                    <div
                                        style={{
                                            cursor: column.sortable
                                                ? "pointer"
                                                : "default",
                                            justifyContent:
                                                column.align === "center"
                                                    ? column.align
                                                    : "",
                                        }}
                                        className={`${s.tableHeadCellWrapper} ${
                                            sortConfig?.key === column.key
                                                ? s.activeSort
                                                : ""
                                        }`}
                                    >
                                        <span>{column.label}</span>
                                        {sortConfig?.key === column.key && (
                                            <SortIcon className={s.sortIcon} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={s.tableBody}>
                        {tableData.length > 0 ? (
                            tableData.map((row: any, rowIndex) => (
                                <tr key={rowIndex} className={s.row}>
                                    {columns.map((column) => {
                                        if (
                                            column.type === "special" &&
                                            SpecialCell
                                        ) {
                                            return (
                                                <td
                                                    key={column.key}
                                                    className={s.cell}
                                                >
                                                    <SpecialCell
                                                        user={
                                                            row.user
                                                                ? row.user
                                                                : null
                                                        }
                                                        avatar={
                                                            row?.user?.image ||
                                                            row?.image
                                                        }
                                                        firstName={
                                                            row?.user
                                                                ?.firstName ||
                                                            row?.firstName
                                                        }
                                                        lastName={
                                                            row?.user
                                                                ?.lastName ||
                                                            row?.lastName
                                                        }
                                                        fullName={
                                                            row?.username
                                                                ? `${row?.firstName} ${row?.lastName} ${row?.maidenName}`
                                                                : undefined
                                                        }
                                                        {...specialCellProps}
                                                    />
                                                </td>
                                            );
                                        }

                                        if (column.type === "birthDate") {
                                            return (
                                                <td
                                                    key={column.key}
                                                    className={s.cell}
                                                >
                                                    <BirthDateCell
                                                        date={row.birthDate}
                                                    />
                                                </td>
                                            );
                                        }

                                        if (column.type === "button") {
                                            return (
                                                <td
                                                    key={column.key}
                                                    className={s.cell}
                                                >
                                                    <div
                                                        className={
                                                            s.buttonWrapper
                                                        }
                                                    >
                                                        {ActionButton ? (
                                                            <ActionButton
                                                                {...actionButtonProps}
                                                                id={row.id}
                                                            />
                                                        ) : (
                                                            <Button
                                                                className={
                                                                    s.button
                                                                }
                                                            >
                                                                <OptionIcon
                                                                    className={
                                                                        s.icon
                                                                    }
                                                                />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td
                                                key={column.key}
                                                style={{
                                                    textAlign: column.align,
                                                }}
                                                className={`${s.cell} ${
                                                    column.type === "lite"
                                                        ? s.textLite
                                                        : ""
                                                } ${
                                                    column.type === "main"
                                                        ? s.textMain
                                                        : ""
                                                } ${
                                                    column.type === "color"
                                                        ? s.textColor
                                                        : ""
                                                } ${
                                                    column.type === "multiline"
                                                        ? s.textMultiline
                                                        : ""
                                                }`}
                                            >
                                                {row[column.key] !==
                                                    undefined &&
                                                row[column.key] !== null
                                                    ? String(row[column.key])
                                                    : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className={s.cell}>
                                    Нет данных для отображения
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={s.bottomPanelWrapper}>
                <div className={s.rowsPerPage}>
                    <span>Строк на странице:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            onRowsPerPageChange(Number(e.target.value));
                            onPageChange(1);
                        }}
                        className={s.select}
                    >
                        {[5, 7, 10, 15, 25].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoading && <span className={s.loading}>Загрузка...</span>}

                <div className={s.pagination}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={s.paginationButton}
                    >
                        <ChevronLeft className={s.paginationIcon} />
                    </button>

                    {pagesArray.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`${s.paginationButton} ${
                                currentPage === page ? s.active : ""
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={s.paginationButton}
                    >
                        <ChevronLeft
                            className={s.paginationIcon}
                            style={{ transform: "rotate(0.5turn)" }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};
