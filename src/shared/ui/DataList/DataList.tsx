import type { FunctionComponent } from "react";
import s from "./DataList.module.scss";
import { DataListItem } from "../DataListItem/DataListItem";

interface DataListProps<T> {
    data: T[];
    type: "post" | "user" | "comment";

    ActionButton?: FunctionComponent<any>;
    actionButtonProps?: any;
}

export const DataList: FunctionComponent<DataListProps<any>> = ({
    data,
    type,
    ActionButton,
    actionButtonProps,
}) => {
    return (
        <div className={s.wrapper}>
            {data.map((item) => (
                <DataListItem
                    key={item.id}
                    data={item}
                    type={type}
                    ActionButton={ActionButton}
                    actionButtonProps={actionButtonProps}
                />
            ))}
        </div>
    );
};
