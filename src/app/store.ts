import { configureStore } from "@reduxjs/toolkit";
import { authApi, authMiddleware, authReducer } from "./api/auth/authSliceApi";
import {
    postsApi,
    postsMiddleware,
    postsReducer,
} from "./api/posts/postsSliceApi";
import { usersApi, usersMiddleware } from "./api/users/usersSliceApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authReducer,
        [postsApi.reducerPath]: postsReducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authMiddleware,
            postsMiddleware,
            usersMiddleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
