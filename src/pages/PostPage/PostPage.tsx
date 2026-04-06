import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { StandardPageLayout } from "../../app/layouts";
import {
    useGetPostByIdQuery,
    useGetPostCommentsQuery,
} from "../../app/api/posts/postsSliceApi";
import {
    DataList,
    DataTable,
    ToButton,
    useSearchQueryPageLimitAndSort,
} from "../../shared";
import { useMediaQuery } from "react-responsive";
import s from "./PostPage.module.scss";
import { ProfileCell } from "../PostsPage/ProfileCell/ProfileCell";
import type { Column } from "../../shared/ui/DataTable/DataTable";

interface PostPageProps {}

export const PostPage: FunctionComponent<PostPageProps> = () => {
    const { id } = useParams();
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

    const {
        data: postData,
        isLoading,
        isFetching,
        isError,
    } = useGetPostByIdQuery(parseInt(id || ""));

    const { data: commentsData } = useGetPostCommentsQuery({
        postId: parseInt(id || ""),
        search: debouncedSearch,
    });

    const columns: Column[] = [
        {
            key: "body",
            label: "Комментарий",
            type: "multiline",
        },
        { key: "user", label: "Автор", type: "special", width: "152px" },
    ];

    return (
        <StandardPageLayout
            title="Комментарии к посту"
            subtitle={postData?.body || "Загрузка..."}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            backButtonLabel={"Назад к списку публикаций"}
            backButtonLink="/posts"
            searchPlaceholder="Поиск по комментариям"
        >
            {isError && <div>Произошла ошибка</div>}

            {isMobile ? (
                <div className={s.mobileWrapper}>
                    <DataList
                        data={commentsData?.comments || []}
                        type="comment"
                    />
                    {isLoading && <div>Загрузка...</div>}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    tableData={commentsData?.comments || []}
                    totalCount={commentsData?.total || 0}
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
