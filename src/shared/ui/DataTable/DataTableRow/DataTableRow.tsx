import { useEffect, type FunctionComponent } from "react";
import { BirthDateCell } from "../../../../pages/AdminsPage/BirthDateCell/BirthDateCell";
import { Button, Dropdown } from "@heroui/react";
import s from "./DataTableRow.module.scss";
import { useDeleteUserMutation } from "../../../../app/api/users/usersSliceApi";
import DropdownButton from "../DropdownButton/DropdownButton";

interface DataTableRowProps {
    row: any;
    rowIndex: number;
    columns: any[];
    ActionButton?: FunctionComponent<any>;
    actionButtonProps?: any;
    SpecialCell?: FunctionComponent<any>;
    specialCellProps?: any;
}

const DataTableRow: FunctionComponent<DataTableRowProps> = ({
    row,
    rowIndex,
    columns,
    ActionButton,
    actionButtonProps,
    SpecialCell,
    specialCellProps,
}) => {
    const [
        deleteUser,
        { data: deletedUser, isSuccess: isDeleted, error: deleteError },
    ] = useDeleteUserMutation();

    const handleDeleteUser = (id: number) => {
        console.log(`delete user ${id}`);
        deleteUser(id);
    };

    useEffect(() => {
        if (isDeleted) {
            console.log("user deleted");
        }

        if (deleteError) {
            console.log("error deleting user");
        }
    }, [isDeleted, deleteError]);

    useEffect(() => {
        if (deletedUser) {
            console.log("user deleted");
        }
    }, [deletedUser]);

    return (
        <tr key={rowIndex} className={s.row}>
            {columns.map((column) => {
                if (column.type === "special" && SpecialCell) {
                    return (
                        <td key={column.key} className={s.cell}>
                            <SpecialCell
                                user={row.user ? row.user : null}
                                avatar={row?.user?.image || row?.image}
                                firstName={
                                    row?.user?.firstName || row?.firstName
                                }
                                lastName={row?.user?.lastName || row?.lastName}
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
                        <td key={column.key} className={s.cell}>
                            <BirthDateCell date={row.birthDate} />
                        </td>
                    );
                }

                if (column.type === "button") {
                    return (
                        <td key={column.key} className={s.cell}>
                            <div className={s.buttonWrapper}>
                                {ActionButton ? (
                                    <ActionButton
                                        {...actionButtonProps}
                                        id={row.id}
                                    />
                                ) : (
                                    <DropdownButton
                                        onDelete={() =>
                                            handleDeleteUser(row.id)
                                        }
                                    />
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
                            column.type === "lite" ? s.textLite : ""
                        } ${column.type === "main" ? s.textMain : ""} ${
                            column.type === "color" ? s.textColor : ""
                        } ${
                            column.type === "multiline" ? s.textMultiline : ""
                        }`}
                    >
                        {row[column.key] !== undefined &&
                        row[column.key] !== null
                            ? String(row[column.key])
                            : "—"}
                    </td>
                );
            })}
        </tr>
    );
};

export default DataTableRow;
