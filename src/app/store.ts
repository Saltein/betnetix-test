import { configureStore } from "@reduxjs/toolkit";
import { authApi, authMiddleware, authReducer } from "./api/authSliceApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
