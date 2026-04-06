import { createApi } from "@reduxjs/toolkit/query/react";
import {
    type GetCurrentUserResponse,
    type LoginResponse,
    type LoginParams,
} from "./authApiTypes";
import { baseQueryWithReauth } from "../baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginParams>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body: body,
            }),
        }),
        getCurrentUser: builder.query<GetCurrentUserResponse, void>({
            query: () => ({
                url: "/auth/me",
            }),
        }),
    }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;

export const authReducer = authApi.reducer;
export const authMiddleware = authApi.middleware;
