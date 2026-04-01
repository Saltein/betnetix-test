import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import {
    type GetCurrentUserResponse,
    type LoginResponse,
    type LoginParams,
    type RefreshTokenParams,
    type RefreshTokenResponse,
} from "./authApiTypes";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://test-api.live-server.xyz",
    prepareHeaders: (headers) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
});

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
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
        refreshSession: builder.mutation<
            RefreshTokenResponse,
            RefreshTokenParams | void
        >({
            query: (body) => ({
                url: "/auth/refresh",
                method: "POST",
                body: body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useGetCurrentUserQuery,
    useRefreshSessionMutation,
} = authApi;

export const authReducer = authApi.reducer;
export const authMiddleware = authApi.middleware;
