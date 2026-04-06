import type { FunctionComponent } from "react";
import s from "./ProfileCell.module.scss";
import { useGetUserByIdQuery } from "../../../app/api/users/usersSliceApi";

export interface ProfileCellProps {
    avatar: string;
    firstName: string;
    lastName: string;
    fullName: string;
    user: { id: number; username: string; fullName: string } | null;
}

export const ProfileCell: FunctionComponent<ProfileCellProps> = ({
    avatar,
    firstName,
    lastName,
    fullName,
    user,
}) => {
    if (user && user.hasOwnProperty("id")) {
        const { data: userData } = useGetUserByIdQuery(user.id);

        return (
            <div className={s.wrapper}>
                <img src={userData?.image} alt="avatar" className={s.avatar} />
                <span className={s.name}>
                    {userData?.firstName} {userData?.lastName?.[0] || ""}.
                </span>
            </div>
        );
    } else {
        return (
            <div className={s.wrapper}>
                <img src={avatar} alt="avatar" className={s.avatar} />
                {fullName ? (
                    <span className={s.name}>{fullName}</span>
                ) : (
                    <span className={s.name}>
                        {firstName} {lastName?.[0] || ""}.
                    </span>
                )}
            </div>
        );
    }
};
