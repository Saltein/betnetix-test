import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import {
    type GetCurrentUserResponse,
    type LoginResponse,
    type LoginParams,
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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "POST",
                credentials: "include",
            },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as RefreshTokenResponse)
                .accessToken;
            Cookies.set("accessToken", newAccessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            Cookies.remove("accessToken");
        }
    }

    return result;
};

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
