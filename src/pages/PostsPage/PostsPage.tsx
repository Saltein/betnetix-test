import { type FunctionComponent } from "react";
import { StandardPageLayout } from "../../app/layouts";
import {
    DataList,
    DataTable,
    useSearchQueryPageLimitAndSort,
    ToButton,
} from "../../shared";
import { useGetAllPostsQuery } from "../../app/api/posts/postsSliceApi";
import type { Column } from "../../shared/ui/DataTable/DataTable";
import { ProfileCell } from "./ProfileCell/ProfileCell";
import { useMediaQuery } from "react-responsive";
import s from "./PostsPage.module.scss";

interface PostsPageProps {}

export const PostsPage: FunctionComponent<PostsPageProps> = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const {
        searchQuery,
        setSearchQuery,
        debouncedSearch,
        page,
        setPage,
        limit,
        setLimit,
        sortConfig,
        setSortConfig,
    } = useSearchQueryPageLimitAndSort();

    const { data, isLoading, isFetching, isError } = useGetAllPostsQuery({
        page,
        limit: isMobile ? 0 : limit,
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
    
    return (
        <StandardPageLayout
            title="Публикации"
            subtitle="Управление публикациями пользователей"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            columns={columns}
            searchPlaceholder="Поиск по публикациям"
        >
            {isError && <div>Произошла ошибка</div>}

            {isMobile ? (
                <div className={s.mobileWrapper}>
                    <DataList
                        data={data?.posts || []}
                        type="post"
                        ActionButton={ToButton}
                        actionButtonProps={{ to: "/post" }}
                    />
                    {isLoading && <div>Загрузка...</div>}
                </div>
            ) : (
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
            )}
        </StandardPageLayout>
    );
};
