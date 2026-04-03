import { useState, useMemo, type FunctionComponent, useEffect } from "react";
import ChevronLeft from "../../assets/icons/leftChevron.svg?react";
import SortIcon from "../../assets/icons/sort.svg?react";

import s from "./DataTable.module.scss";

export interface Column {
    key: string;
    label: string;
    type: "lite" | "main" | "color" | "special" | "default" | "button";
    width?: string;
    align?: "left" | "center" | "right";
}

interface TableProps<T> {
    columns: Column[];
    tableData: T[];
    ActionButton?: FunctionComponent<T>;
    actionButtonProps?: any;
    SpecialCell?: FunctionComponent<T>;
    searchQuery?: string;
}

export const DataTable: FunctionComponent<TableProps<any>> = ({
    columns,
    tableData,
    ActionButton,
    actionButtonProps,
    SpecialCell,
    searchQuery,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    // Сортировка
    const handleSort = (key: string) => {
        if (sortConfig?.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
        setCurrentPage(1);
    };

    const data = useMemo(() => {
        if (!searchQuery) return tableData;

        return tableData.filter((item) =>
            item.body.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [tableData, searchQuery]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return [...data];

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            let comparison = 0;
            if (typeof aValue === "string" && typeof bValue === "string") {
                comparison = aValue.localeCompare(bValue, undefined, {
                    numeric: true,
                });
            } else {
                comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }

            return comparison * (sortConfig.direction === "asc" ? 1 : -1);
        });
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const [pagesArray, setPagesArray] = useState([1, 2, 3]);

    useEffect(() => {
        let left = 1;
        let right = 3;
        let middle = right - left;

        let newArray = [];

        if (currentPage === 1) {
            left = 1;
            middle = 2;
            right = 3;
        } else if (currentPage === totalPages) {
            left = totalPages - 2;
            middle = totalPages - 1;
            right = totalPages;
        } else {
            left = currentPage - 1;
            middle = currentPage;
            right = currentPage + 1;
        }

        newArray = [left, middle, right];

        if (totalPages === 2) {
            left = 1;
            middle = 2;

            newArray = [left, middle];
        }
        if (totalPages === 1) {
            left = 1;

            newArray = [left];
        }

        setPagesArray(newArray);
    }, [currentPage, tableData, rowsPerPage, totalPages]);

    return (
        <div className={s.wrapper}>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead className={s.tableHead}>
                        <tr className={s.tableHeadRow}>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => handleSort(column.key)}
                                    className={s.tableHeadCell}
                                    style={{ width: column.width }}
                                >
                                    <div
                                        style={{
                                            justifyContent:
                                                column.align === "center"
                                                    ? column.align
                                                    : "",
                                        }}
                                        className={`${s.tableHeadCellWrapper} ${sortConfig?.key === column.key ? s.activeSort : ""}`}
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
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className={s.row}>
                                    {columns.map((column) => {
                                        if (
                                            column.type === "special" &&
                                            SpecialCell
                                        ) {
                                            return (
                                                <td
                                                    key={column.key}
                                                    style={{}}
                                                    className={s.cell}
                                                >
                                                    <SpecialCell
                                                        avatar={row.user.image}
                                                        firstName={
                                                            row.user.firstName
                                                        }
                                                        lastName={
                                                            row.user.lastName
                                                        }
                                                    />
                                                </td>
                                            );
                                        }

                                        if (column.type === "button") {
                                            return (
                                                <td
                                                    key={column.key}
                                                    style={{}}
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
                                                            <span>...</span>
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
                                                className={`${s.cell} ${column.type === "lite" ? s.textLite : ""} ${column.type === "main" ? s.textMain : ""} ${column.type === "color" ? s.textColor : ""}`}
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
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className={s.select}
                    >
                        {[5, 10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={s.pagination}>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={s.paginationButton}
                    >
                        <ChevronLeft className={s.paginationIcon} />
                    </button>

                    {pagesArray.map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`${s.paginationButton} ${currentPage === page ? s.active : ""}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
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
