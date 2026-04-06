import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";
import type { GetPostCommentsResponse, Post } from "./postsApiTypes";

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAllPosts: builder.query<
            { posts: any[]; total: number },
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
                const enrichPosts = async (
                    posts: any[],
                    usersCache: Record<number, any>,
                ) => {
                    return await Promise.all(
                        posts.map(async (post: any) => {
                            if (!usersCache[post.userId]) {
                                const userResult = await baseQuery({
                                    url: `/users/${post.userId}?select=image,firstName,lastName`,
                                });
                                if (userResult.data) {
                                    usersCache[post.userId] = userResult.data;
                                }
                            }
                            const user = usersCache[post.userId];

                            const commentsResult = await baseQuery({
                                url: `/posts/${post.id}/comments?select=total`,
                            });
                            const commentsCount =
                                (commentsResult.data as any)?.total ?? 0;

                            return {
                                id: post.id,
                                body: post.body,
                                likes: post.reactions?.likes ?? 0,
                                views: post.views ?? 0,
                                comments: commentsCount,
                                user: {
                                    image: user?.image,
                                    firstName: user?.firstName,
                                    lastName: user?.lastName,
                                },
                            };
                        }),
                    );
                };

                const fetchPostsBatch = async (
                    skip: number,
                    batchLimit: number,
                    retries = 3,
                ): Promise<{ posts: any[]; total: number }> => {
                    let url = "";
                    if (search) {
                        url = `/posts/search?q=${search}&limit=${batchLimit}&skip=${skip}`;
                    } else {
                        url = `/posts?limit=${batchLimit}&skip=${skip}`;
                    }
                    if (sortBy) {
                        const sortKey =
                            sortBy === "likes" ? "reactions" : sortBy;
                        url += `&sortBy=${sortKey}&order=${order ?? "asc"}`;
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
                        return fetchPostsBatch(skip, batchLimit, retries - 1);
                    }

                    if (result.error) throw result.error;
                    return result.data as { posts: any[]; total: number };
                };

                const needFastLoad = limit > 25 || limit === 0;

                if (!needFastLoad) {
                    let sortByNew;
                    if (sortBy === "likes") {
                        sortByNew = "reactions";
                    } else {
                        sortByNew = sortBy;
                    }
                    const skip = (page - 1) * limit;
                    let url = "";
                    if (search) {
                        url = `/posts/search?q=${search}&limit=${limit}&skip=${skip}`;
                    } else {
                        url = `/posts?limit=${limit}&skip=${skip}`;
                    }
                    if (sortByNew) {
                        url += `&sortBy=${sortByNew}&order=${order ?? "asc"}`;
                    }
                    const postsResult = await baseQuery({ url });
                    if (postsResult.error) {
                        return { error: postsResult.error };
                    }
                    const { posts, total } = postsResult.data as any;
                    const usersCache: Record<number, any> = {};
                    const enrichedPosts = await enrichPosts(posts, usersCache);
                    return { data: { posts: enrichedPosts, total } };
                }

                const effectiveSkip = limit === 0 ? 0 : (page - 1) * limit;
                const firstBatchLimit = 25;

                let firstBatch;
                try {
                    firstBatch = await fetchPostsBatch(
                        effectiveSkip,
                        firstBatchLimit,
                    );
                } catch (error) {
                    return { error: error as any };
                }

                const { posts: firstPosts, total } = firstBatch;
                const usersCache: Record<number, any> = {};
                const enrichedFirstPosts = await enrichPosts(
                    firstPosts,
                    usersCache,
                );

                const result = { data: { posts: enrichedFirstPosts, total } };

                let remainingLimit: number;
                if (limit === 0) {
                    remainingLimit = total - firstBatchLimit;
                } else {
                    remainingLimit = limit - firstBatchLimit;
                }

                if (remainingLimit > 0) {
                    (async () => {
                        try {
                            let nextSkip = effectiveSkip + firstBatchLimit;
                            let loaded = firstBatchLimit;
                            let allPosts = [...enrichedFirstPosts];
                            const backgroundUsersCache = { ...usersCache };
                            let currentRemaining = remainingLimit;

                            while (currentRemaining > 0) {
                                const batchSize = Math.min(
                                    currentRemaining,
                                    25,
                                );
                                let batch: {
                                    posts: any[];
                                    total: number;
                                } | null = null;
                                let retries = 3;

                                while (retries > 0 && !batch) {
                                    try {
                                        batch = await fetchPostsBatch(
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

                                const enrichedBatch = await enrichPosts(
                                    batch.posts,
                                    backgroundUsersCache,
                                );
                                allPosts = [...allPosts, ...enrichedBatch];
                                loaded += batchSize;
                                currentRemaining -= batchSize;
                                nextSkip += batchSize;

                                api.dispatch(
                                    postsApi.util.updateQueryData(
                                        "getAllPosts",
                                        { page, limit, search, sortBy, order },
                                        (draft) => {
                                            draft.posts = allPosts;
                                            draft.total = total;
                                        },
                                    ),
                                );
                            }
                        } catch (err) {
                            console.error("Background loading failed:", err);
                        }
                    })();
                }

                return result;
            },
        }),

        getPostById: builder.query<Post, number>({
            query: (id) => `/posts/${id}`,
        }),

        getPostComments: builder.query<
            GetPostCommentsResponse,
            { postId: number; search?: string }
        >({
            async queryFn({ postId, search }, _api, _extra, baseQuery) {
                const result = await baseQuery({
                    url: `/posts/${postId}/comments`,
                });

                if (result.error) {
                    return { error: result.error };
                }

                const data = result.data as GetPostCommentsResponse;

                if (search && search.trim() !== "") {
                    const filteredComments = data.comments.filter((comment) => {
                        const searchLower = search.toLowerCase();
                        return (
                            comment.body?.toLowerCase().includes(searchLower) ||
                            comment.user?.username
                                ?.toLowerCase()
                                .includes(searchLower)
                        );
                    });

                    return {
                        data: {
                            ...data,
                            comments: filteredComments,
                            total: filteredComments.length,
                        },
                    };
                }

                return { data };
            },
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useGetPostCommentsQuery,
} = postsApi;
export const postsReducer = postsApi.reducer;
export const postsMiddleware = postsApi.middleware;
