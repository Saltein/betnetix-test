import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

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
                _api,
                _extra,
                baseQuery,
            ) {
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

                const enrichedPosts = await Promise.all(
                    posts.map(async (post: any) => {
                        if (!usersCache[post.userId]) {
                            const userResult = await baseQuery({
                                url: `/users/${post.userId}`,
                            });

                            if (userResult.data) {
                                usersCache[post.userId] = userResult.data;
                            }
                        }

                        const user = usersCache[post.userId];

                        const commentsResult = await baseQuery({
                            url: `/posts/${post.id}/comments`,
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

                return {
                    data: {
                        posts: enrichedPosts,
                        total,
                    },
                };
            },
        }),
    }),
});

export const { useGetAllPostsQuery } = postsApi;
export const postsReducer = postsApi.reducer;
export const postsMiddleware = postsApi.middleware;
