import type { FunctionComponent } from "react";
import s from "./ProfileCell.module.scss";

export interface ProfileCellProps {
    avatar: string;
    firstName: string;
    lastName: string;
}

export const ProfileCell: FunctionComponent<ProfileCellProps> = ({
    avatar,
    firstName,
    lastName,
}) => {
    return (
        <div className={s.wrapper}>
            <img src={avatar} alt="avatar" className={s.avatar} />
            <span className={s.name}>
                {firstName} {lastName[0]}.
            </span>
        </div>
    );
};
