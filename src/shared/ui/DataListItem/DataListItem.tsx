import { useEffect, type FunctionComponent } from "react";
import s from "./DataListItem.module.scss";

import ViewsIcon from "../../assets/icons/views.svg?react";
import LikesIcon from "../../assets/icons/likes.svg?react";
import CommentsIcon from "../../assets/icons/comments.svg?react";
import {
    useDeleteUserMutation,
    useGetUserByIdQuery,
} from "../../../app/api/users/usersSliceApi";
import DropdownButton from "../DataTable/DropdownButton/DropdownButton";
import { BirthDateCell } from "../../../pages/AdminsPage/BirthDateCell/BirthDateCell";

interface DataListItemProps {
    data: any;
    type: "post" | "user" | "comment";

    ActionButton?: FunctionComponent<any>;
    actionButtonProps?: any;
}

export const DataListItem: FunctionComponent<DataListItemProps> = ({
    data,
    type,
    ActionButton,
    actionButtonProps,
}) => {
    const { data: userData } = useGetUserByIdQuery(
        type === "comment" && data.user.id ? data.user.id : data.id,
    );

    const [
        deleteUser,
        { data: deletedUser, isSuccess: isDeleted, error: deleteError },
    ] = useDeleteUserMutation();

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
        <div className={s.dataListItemWrapper}>
            {type === "post" && (
                <>
                    <div className={s.header}>
                        <span className={s.id}>{data.id}</span>
                        {ActionButton ? (
                            <ActionButton {...actionButtonProps} id={data.id} />
                        ) : (
                            <span>...</span>
                        )}
                    </div>

                    <div className={s.post}>
                        <div className={s.user}>
                            <img
                                className={s.avatar}
                                src={data.user.image}
                                alt="avatar"
                            />
                            <span className={s.name}>
                                {data.user.firstName}{" "}
                                {data.user.lastName?.[0] || ""}.
                            </span>
                        </div>
                        <div className={s.body}>{data.body}</div>
                    </div>

                    <div className={s.footer}>
                        <div className={s.metric}>
                            <ViewsIcon className={s.icon} />
                            <span className={s.metricText}>{data.views}</span>
                        </div>
                        <div className={s.metric}>
                            <LikesIcon className={s.icon} />
                            <span className={s.metricText}>{data.likes}</span>
                        </div>
                        <div className={s.metric}>
                            <CommentsIcon className={s.icon} />
                            <span className={s.metricText}>
                                {data.comments}
                            </span>
                        </div>
                    </div>
                </>
            )}

            {type === "user" && (
                <div className={s.userCard}>
                    <div className={s.header}>
                        <div className={s.user}>
                            <img
                                className={s.avatar}
                                src={userData?.image}
                                alt="avatar"
                            />
                        </div>
                        <DropdownButton
                            onDelete={() => {
                                console.log("delete user", data.id);
                                deleteUser(data.id);
                            }}
                        />
                    </div>
                    <span className={`${s.name} ${s.bold}`}>
                        {userData?.firstName} {userData?.lastName}{" "}
                        {userData?.maidenName}
                    </span>
                    <span className={s.email}>{userData?.email}</span>

                    <div className={s.dateGender}>
                        <div className={`${s.con} ${s.birth}`}>
                            <span className={s.label}>Дата рождения</span>
                            <BirthDateCell
                                date={userData?.birthDate || "1900-01-01"}
                                fontSize="14px"
                            />
                        </div>

                        <div className={`${s.con} ${s.gender}`}>
                            <span className={s.label}>Пол</span>
                            <span className={s.value}>
                                {userData?.gender === "male"
                                    ? "Мужской"
                                    : "Женский"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {type === "comment" && (
                <div className={s.wrapper}>
                    <div className={s.header}>
                        <div className={s.user}>
                            <img
                                className={s.avatar}
                                src={userData?.image}
                                alt="avatar"
                            />
                            <span className={s.name}>
                                {userData?.firstName}{" "}
                                {userData?.lastName?.[0] || ""}.
                            </span>
                        </div>
                    </div>

                    <div className={s.post}>
                        <div className={s.comment}>{data.body}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
