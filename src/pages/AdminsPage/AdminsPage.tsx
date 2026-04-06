import type { FunctionComponent } from "react";
import s from "./AdminsPage.module.scss";
import { StandardPageLayout } from "../../app/layouts";
import {
    DataList,
    DataTable,
    useSearchQueryPageLimitAndSort,
} from "../../shared";
import { useMediaQuery } from "react-responsive";
import { useGetAllUsersPaginatedQuery } from "../../app/api/users/usersSliceApi";
import type { Column } from "../../shared/ui/DataTable/DataTable";
import { ProfileCell } from "../PostsPage/ProfileCell/ProfileCell";

interface AdminsPageProps {}

export const AdminsPage: FunctionComponent<AdminsPageProps> = () => {
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
        data: usersData,
        isLoading,
        isFetching,
        isError,
    } = useGetAllUsersPaginatedQuery({
        page,
        limit: isMobile ? 0 : limit,
        search: debouncedSearch,
        sortBy: sortConfig?.key,
        order: sortConfig?.direction,
    });

    const adminsData =
        usersData &&
        (() => {
            const filteredAdmins = usersData.users
                .filter((user) => user.role === "admin")
                .map((user) => ({
                    ...user,
                    gender:
                        user.gender === "male"
                            ? "Мужской"
                            : user.gender === "female"
                              ? "Женский"
                              : user.gender,
                }));
            return {
                users: filteredAdmins,
                total: filteredAdmins.length,
            };
        })();

    const columns: Column[] = [
        {
            key: "user",
            label: "Администратор",
            type: "special",
        },
        {
            key: "email",
            label: "Email",
            type: "color",
            width: "320px",
        },
        {
            key: "birthDate",
            label: "Дата рождения",
            type: "birthDate",
            width: "230px",
        },
        {
            key: "gender",
            label: "Пол",
            type: "default",
            width: "136px",
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
            title="Администраторы"
            subtitle={"Управление администраторами системы"}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Поиск по администраторам"
        >
            {isError && <div>Произошла ошибка</div>}

            {isMobile ? (
                <div className={s.mobileWrapper}>
                    <DataList data={adminsData?.users || []} type="comment" />
                    {isLoading && <div>Загрузка...</div>}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    tableData={adminsData?.users || []}
                    totalCount={adminsData?.total || 0}
                    currentPage={page}
                    onPageChange={setPage}
                    rowsPerPage={limit}
                    onRowsPerPageChange={setLimit}
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
