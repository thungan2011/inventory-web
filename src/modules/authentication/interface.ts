export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    gender: boolean;
    birthday: Date;
    avatar: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}