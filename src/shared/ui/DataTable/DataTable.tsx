import { useState, useMemo } from "react";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

import s from "./DataTable.module.scss";

export interface Column {
    key: string;
    label: string;
    type: "lite" | "main" | "color" | "special" | "default";
    width?: string;
}

interface TableProps<T extends Record<string, any>> {
    columns: Column[];
    data: T[];
    actionButton?: React.ReactNode;
    specialCell?: React.ReactNode;
}

export const DataTable = <T extends Record<string, any>>({
    columns,
    data,
}: TableProps<T>) => {
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
        setCurrentPage(1); // Сброс страницы при смене сортировки
    };

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

    // Пагинация
    const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, sortedData.length);

    return (
        <div className={s.wrapper}>
            {/* Таблица */}
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
                                        className={`${s.tableHeadCellWrapper} ${sortConfig?.key === column.key ? s.activeSort : ""}`}
                                    >
                                        <span>{column.label}</span>
                                        {sortConfig?.key === column.key &&
                                            (sortConfig.direction === "asc" ? (
                                                <ChevronUpIcon className="h-4 w-4 text-blue-600" />
                                            ) : (
                                                <ChevronDownIcon className="h-4 w-4 text-blue-600" />
                                            ))}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={s.tableBody}>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className={s.row}>
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`${s.cell} ${column.type === "lite" ? s.textLite : ""} ${column.type === "main" ? s.textMain : ""} ${column.type === "color" ? s.textColor : ""}`}
                                        >
                                            {row[column.key] !== undefined &&
                                            row[column.key] !== null
                                                ? String(row[column.key])
                                                : "—"}
                                        </td>
                                    ))}
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

            {/* Нижняя панель: выбор строк + пагинация */}
            <div className={s.bottomPanelWrapper}>
                {/* Инфо + выбор количества строк */}
                <div className={s.bottomPanel}>
                    <div>
                        Показано{" "}
                        <span className="font-medium text-gray-900">
                            {startEntry}–{endEntry}
                        </span>{" "}
                        из{" "}
                        <span className="font-medium text-gray-900">
                            {sortedData.length}
                        </span>
                    </div>

                    <div className={s.rowsPerPage}>
                        <span className="text-gray-500">
                            Строк на странице:
                        </span>
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
                </div>

                {/* Пагинация */}
                <div className={s.pagination}>
                    {/* Первая страница */}
                    <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className={`${s.paginationButton} ${s.first}`}
                    >
                        <ChevronDoubleLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Предыдущая */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${s.paginationButton} ${s.prev}`}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Текущая страница / Всего */}
                    <div className={s.currentPage}>
                        {currentPage} из {totalPages}
                    </div>

                    {/* Следующая */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${s.paginationButton} ${s.next}`}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>

                    {/* Последняя страница */}
                    <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`${s.paginationButton} ${s.last}`}
                    >
                        <ChevronDoubleRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
