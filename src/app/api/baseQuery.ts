import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import type { RefreshTokenResponse } from "./auth/authApiTypes";

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

export const baseQueryWithReauth = async (
    args: any,
    api: any,
    extraOptions: any,
) => {
    let result = await baseQuery(args, api, extraOptions);

    const refreshToken = localStorage.getItem("refreshToken"); // чисто для того, чтобы обойти cors, ведь он отклоняет credentials

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh",
                method: "POST",
                body: { refreshToken },
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
