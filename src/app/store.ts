import { configureStore } from "@reduxjs/toolkit";
import { authApi, authMiddleware, authReducer } from "./api/auth/authSliceApi";
import {
    postsApi,
    postsMiddleware,
    postsReducer,
} from "./api/posts/postsSliceApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authReducer,
        [postsApi.reducerPath]: postsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware, postsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
