import type { User } from "../users/usersApiTypes";

export interface LoginParams {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface GetCurrentUserResponse extends User {}

export interface RefreshTokenParams {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
