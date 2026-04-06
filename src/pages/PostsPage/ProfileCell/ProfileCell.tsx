import type { FunctionComponent } from "react";
import s from "./ProfileCell.module.scss";
import { useGetUserByIdQuery } from "../../../app/api/auth/authSliceApi";
import { includes } from "zod";

export interface ProfileCellProps {
    avatar: string;
    firstName: string;
    lastName: string;
    user: { id: number; username: string; fullName: string } | null;
}

export const ProfileCell: FunctionComponent<ProfileCellProps> = ({
    avatar,
    firstName,
    lastName,
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
                <span className={s.name}>
                    {firstName} {lastName?.[0] || ""}.
                </span>
            </div>
        );
    }
};
