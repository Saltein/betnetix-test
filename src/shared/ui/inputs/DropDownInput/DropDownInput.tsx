import type { FunctionComponent } from "react";
import type { Column } from "../../DataTable/DataTable";
import si from "../Input.module.scss";
import s from "./DropDownInput.module.scss";
import DownIcon from "../../../assets/icons/chevronDown.svg?react";
import type { SortDirection } from "../../../types";

interface DropDownInputProps {
    label: string;
    items: Column[];
    onChange: (config: { key: string; direction: SortDirection }) => void;
    sortConfig: { key: string; direction: string } | null;
    isMobile?: boolean;
}

export const DropDownInput: FunctionComponent<DropDownInputProps> = ({
    label,
    items,
    onChange,
    sortConfig,
    isMobile,
}) => {
    return (
        <div className={s.wrapper}>
            <span className={s.label}>{label}</span>
            <select
                onChange={(e) => {
                    onChange({ key: e.target.value, direction: "asc" });
                    console.log("e.target.value", e.target.value);
                }}
                value={sortConfig ? sortConfig.key : ""}
                className={`${si.input} ${s.input} ${isMobile ? s.mobile : ""} ${isMobile ? si.inputMobile : ""}`}
            >
                {items.map((item) => {
                    if (item.sortable) {
                        return (
                            <option key={item.key} value={item.key}>
                                {item.label}
                            </option>
                        );
                    }
                })}
            </select>
            <DownIcon className={s.icon} />
        </div>
    );
};
