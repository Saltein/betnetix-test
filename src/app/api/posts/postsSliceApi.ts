import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";
import type { GetAllPostResponse, Post } from "./postsApiTypes";

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAllPosts: builder.query<GetAllPostResponse[], void>({
            async queryFn(_, _queryApi, _extraOptions, baseQuery) {
                const postsResult = await baseQuery({
                    url: "/posts",
                });

                if (postsResult.error) {
                    return { error: postsResult.error };
                }

                const posts = (postsResult.data as any).posts;

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
                            likes: post.reactions.likes,
                            views: post.views,
                            comments: commentsCount,
                            user: {
                                image: user?.image,
                                firstName: user?.firstName,
                                lastName: user?.lastName,
                            },
                        };
                    }),
                );

                return { data: enrichedPosts };
            },
        }),
        getPostById: builder.query<Post, number>({
            query: (id) => ({
                url: `/posts/${id}`,
            }),
        }),
    }),
});

export const { useGetAllPostsQuery, useGetPostByIdQuery } = postsApi;

export const postsReducer = postsApi.reducer;
export const postsMiddleware = postsApi.middleware;
