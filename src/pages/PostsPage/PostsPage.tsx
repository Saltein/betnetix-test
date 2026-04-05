import { useState, useEffect, type FunctionComponent } from "react";
import { StandardPageLayout } from "../../app/layouts";
import { DataTable } from "../../shared";
import { useGetAllPostsQuery } from "../../app/api/posts/postsSliceApi";
import type { Column } from "../../shared/ui/DataTable/DataTable";
import { ProfileCell } from "./ProfileCell/ProfileCell";
import { ToButton } from "../../shared/ui/ToButton/ToButton";

interface PostsPageProps {}

export const PostsPage: FunctionComponent<PostsPageProps> = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(7);

    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data, isLoading, isFetching, isError } = useGetAllPostsQuery({
        page,
        limit,
        search: debouncedSearch,
        sortBy: sortConfig?.key,
        order: sortConfig?.direction,
    });

    const columns: Column[] = [
        {
            key: "id",
            label: "ID",
            type: "default",
            width: "90px",
            sortable: true,
        },
        { key: "body", label: "Пост", type: "main" },
        { key: "user", label: "Автор", type: "special", width: "152px" },
        {
            key: "views",
            label: "Просмотры",
            type: "default",
            width: "110px",
            align: "center",
            sortable: true,
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

    if (isError) return <div>Ошибка загрузки</div>;

    return (
        <StandardPageLayout
            title="Публикации"
            subtitle="Управление публикациями пользователей"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
        >
            <DataTable
                columns={columns}
                tableData={data?.posts || []}
                totalCount={data?.total || 0}
                currentPage={page}
                onPageChange={setPage}
                rowsPerPage={limit}
                onRowsPerPageChange={setLimit}
                ActionButton={ToButton}
                actionButtonProps={{ to: "/post" }}
                SpecialCell={ProfileCell}
                isLoading={isLoading || isFetching}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
            />
        </StandardPageLayout>
    );
};
