import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";
import type { AddUserParams, GetUsersResponse, UpdateUserParams, User } from "./usersApiTypes";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        // Оригинальный простой запрос (оставлен для обратной совместимости)
        getAllUsers: builder.query<GetUsersResponse, void>({
            query: () => "/users",
        }),

        getUserById: builder.query<User, number>({
            query: (id) => `/users/${id}`,
        }),

        // Новый endpoint с пагинацией, поиском, сортировкой и fast-load
        getAllUsersPaginated: builder.query<
            { users: User[]; total: number },
            {
                page: number;
                limit: number;
                search?: string;
                sortBy?: string;
                order?: "asc" | "desc";
            }
        >({
            async queryFn(
                { page, limit, search, sortBy, order },
                api,
                _extra,
                baseQuery,
            ) {
                // Вспомогательная функция для выполнения запроса с ретраями при 429
                const fetchUsersBatch = async (
                    skip: number,
                    batchLimit: number,
                    retries = 3,
                ): Promise<{ users: User[]; total: number }> => {
                    let url = "";
                    if (search) {
                        url = `/users/search?q=${search}&limit=${batchLimit}&skip=${skip}`;
                    } else {
                        url = `/users?limit=${batchLimit}&skip=${skip}`;
                    }
                    if (sortBy) {
                        url += `&sortBy=${sortBy}&order=${order ?? "asc"}`;
                    }

                    const result = await baseQuery({ url });

                    if (
                        result.error &&
                        (result.error as any)?.status === 429 &&
                        retries > 0
                    ) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 2000),
                        );
                        return fetchUsersBatch(skip, batchLimit, retries - 1);
                    }

                    if (result.error) throw result.error;
                    return result.data as GetUsersResponse;
                };

                const needFastLoad = limit > 25 || limit === 0;

                // ---- Обычный режим (без фоновой дозагрузки) ----
                if (!needFastLoad) {
                    const skip = (page - 1) * limit;
                    let url = "";
                    if (search) {
                        url = `/users/search?q=${search}&limit=${limit}&skip=${skip}`;
                    } else {
                        url = `/users?limit=${limit}&skip=${skip}`;
                    }
                    if (sortBy) {
                        url += `&sortBy=${sortBy}&order=${order ?? "asc"}`;
                    }
                    const result = await baseQuery({ url });
                    if (result.error) {
                        return { error: result.error };
                    }
                    const { users, total } = result.data as GetUsersResponse;
                    return { data: { users, total } };
                }

                // ---- Fast-load режим (limit > 25 или limit === 0) ----
                const effectiveSkip = limit === 0 ? 0 : (page - 1) * limit;
                const firstBatchLimit = 25;

                let firstBatch;
                try {
                    firstBatch = await fetchUsersBatch(
                        effectiveSkip,
                        firstBatchLimit,
                    );
                } catch (error) {
                    return { error: error as any };
                }

                const { users: firstUsers, total } = firstBatch;
                const result = { data: { users: firstUsers, total } };

                // Сколько ещё нужно подгрузить
                let remainingLimit: number;
                if (limit === 0) {
                    remainingLimit = total - firstBatchLimit;
                } else {
                    remainingLimit = limit - firstBatchLimit;
                }

                if (remainingLimit > 0) {
                    // Фоновая загрузка остальных батчей
                    (async () => {
                        try {
                            let nextSkip = effectiveSkip + firstBatchLimit;
                            let loaded = firstBatchLimit;
                            let allUsers = [...firstUsers];
                            let currentRemaining = remainingLimit;

                            while (currentRemaining > 0) {
                                const batchSize = Math.min(
                                    currentRemaining,
                                    25,
                                );
                                let batch: {
                                    users: User[];
                                    total: number;
                                } | null = null;
                                let retries = 3;

                                while (retries > 0 && !batch) {
                                    try {
                                        batch = await fetchUsersBatch(
                                            nextSkip,
                                            batchSize,
                                            retries,
                                        );
                                    } catch (err) {
                                        retries--;
                                        if (retries === 0) throw err;
                                        await new Promise((resolve) =>
                                            setTimeout(resolve, 2000),
                                        );
                                    }
                                }

                                if (!batch) {
                                    throw new Error("Failed to fetch batch");
                                }

                                allUsers = [...allUsers, ...batch.users];
                                loaded += batchSize;
                                currentRemaining -= batchSize;
                                nextSkip += batchSize;

                                // Обновляем кэш RTK Query
                                api.dispatch(
                                    usersApi.util.updateQueryData(
                                        "getAllUsersPaginated",
                                        { page, limit, search, sortBy, order },
                                        (draft) => {
                                            draft.users = allUsers;
                                            draft.total = total;
                                        },
                                    ),
                                );
                            }
                        } catch (err) {
                            console.error(
                                "Background loading failed for users:",
                                err,
                            );
                        }
                    })();
                }

                return result;
            },
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
        }),

        addUser: builder.mutation<void, AddUserParams>({
            query: (user) => ({
                url: "/users/add",
                method: "POST",
                body: user,
            }),
        }),

        updateUser: builder.mutation<void, UpdateUserParams>({
            query: ({ id, ...patch }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: patch,
            }),
        }),
    }),
});

// Экспорт хуков
export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useGetAllUsersPaginatedQuery,
    useDeleteUserMutation,
    useAddUserMutation,
    useUpdateUserMutation,
} = usersApi;

export const usersReducer = usersApi.reducer;
export const usersMiddleware = usersApi.middleware;
