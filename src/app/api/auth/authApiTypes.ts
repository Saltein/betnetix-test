export type UserRole = "admin" | "moderator" | "user";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName?: string;
    age?: number;
    gender?: string;
    email: string;
    phone?: string;
    username: string;
    password: string;
    birthDate?: string;
    image?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    eyeColor?: string;
    hair?: { color: string; type: string };
    ip?: string;
    address?: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: { lat: number; lng: number };
        country: string;
    };
    macAddress?: string;
    university?: string;
    bank?: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company?: {
        department: string;
        name: string;
        title: string;
        address: {
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            coordinates: { lat: number; lng: number };
            country: string;
        };
    };
    ein?: string;
    ssn?: string;
    userAgent?: string;
    crypto?: {
        coin: string;
        wallet: string;
        network: string;
    };
    role: UserRole;
};

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
