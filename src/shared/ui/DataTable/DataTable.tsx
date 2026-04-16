import { type FunctionComponent } from "react";
import SortIcon from "../../assets/icons/sort.svg?react";
import s from "./DataTable.module.scss";
import type { SortDirection } from "../../types";
import DataTableRow from "./DataTableRow/DataTableRow";
import Pagination from "./Pagination/Pagination";

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
                                <DataTableRow
                                    row={row}
                                    rowIndex={rowIndex}
                                    columns={columns}
                                    ActionButton={ActionButton}
                                    actionButtonProps={actionButtonProps}
                                    SpecialCell={SpecialCell}
                                    specialCellProps={specialCellProps}
                                />
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

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};
