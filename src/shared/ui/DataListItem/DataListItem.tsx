import type { FunctionComponent } from "react";
import s from "./DataListItem.module.scss";

import ViewsIcon from "../../assets/icons/views.svg?react";
import LikesIcon from "../../assets/icons/likes.svg?react";
import CommentsIcon from "../../assets/icons/comments.svg?react";
import { useGetUserByIdQuery } from "../../../app/api/users/usersSliceApi";

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
        type === "comment" && data.user.id,
    );

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

            {type === "user" && <div>user</div>}

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
