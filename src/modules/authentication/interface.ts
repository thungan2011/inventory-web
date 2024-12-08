export const ROLE_ADMIN = 'ADMIN';
export const ROLE_EMPLOYEE_SALE = 'EMPLOYEE_SALE';
export const ROLE_WAREHOUSE_KEEPER = 'WAREHOUSE_KEEPER';

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