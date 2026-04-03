import { useState, type FunctionComponent } from "react";
import { StandardPageLayout } from "../../app/layouts";
import { DataTable } from "../../shared";
import { useGetAllPostsQuery } from "../../app/api/posts/postsSliceApi";
import type { Column } from "../../shared/ui/DataTable/DataTable";
import { ProfileCell } from "./ProfileCell/ProfileCell";
import { ToButton } from "../../shared/ui/ToButton/ToButton";

interface PostsPageProps {}

export const PostsPage: FunctionComponent<PostsPageProps> = () => {
    const { data, isLoading, isError } = useGetAllPostsQuery();

    const [searchQuery, setSearchQuery] = useState("");

    const columns: Column[] = [
        { key: "id", label: "ID", type: "default", width: "90px" },
        { key: "body", label: "Пост", type: "main" },
        { key: "user", label: "Автор", type: "special", width: "152px" },
        {
            key: "views",
            label: "Просмотры",
            type: "default",
            width: "110px",
            align: "center",
        },
        {
            key: "likes",
            label: "Лайки",
            type: "default",
            width: "110px",
            align: "center",
        },
        {
            key: "comments",
            label: "Комментарии",
            type: "default",
            width: "110px",
            align: "center",
        },
        {
            key: "button",
            label: "",
            type: "button",
            width: "88px",
            align: "center",
        },
    ];

    return (
        <StandardPageLayout
            title="Публикации"
            subtitle="Управление публикациями пользователей"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            <DataTable
                columns={columns}
                tableData={data || []}
                ActionButton={ToButton}
                actionButtonProps={{ to: "/post" }}
                SpecialCell={ProfileCell}
                searchQuery={searchQuery}
                filterColumn="body"
            />
        </StandardPageLayout>
    );
};
