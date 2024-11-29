export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface EmployeeOverview {
    id: number;
    userId: string;
    avatar: string;
    lastName: string;
    firstName: string;
    gender: number;
    email: string;
    phone: string;
    birthday: Date;
    address: string;
    city: string;
    district: string;
    ward: string;
    status: EmployeeStatus,
}

export type EmployeeDetail = EmployeeOverview