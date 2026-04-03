import type { FunctionComponent } from "react";
import { StandardPageLayout } from "../../app/layouts";
import { DataTable } from "../../shared";
import { useGetAllPostsQuery } from "../../app/api/posts/postsSliceApi";
import type { Column } from "../../shared/ui/DataTable/DataTable";

interface PostsPageProps {}

export const PostsPage: FunctionComponent<PostsPageProps> = () => {
    const { data, isLoading, isError } = useGetAllPostsQuery();

    console.log("posts data", data);

    const columns: Column[] = [
        { key: "id", label: "ID", type: "default", width: "90px" },
        { key: "body", label: "Пост", type: "main" },
        { key: "user", label: "Автор", type: "special", width: "152px" },
        { key: "views", label: "Просмотры", type: "default", width: "110px" },
        { key: "likes", label: "Лайки", type: "default", width: "110px" },
        {
            key: "comments",
            label: "Комментарии",
            type: "default",
            width: "204px",
        },
    ];

    return (
        <StandardPageLayout
            title="Публикации"
            subtitle="Управление публикациями пользователей"
        >
            <DataTable columns={columns} data={data || []} />
        </StandardPageLayout>
    );
};
