export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface EmployeeOverview {
    id: number;
    code: string;
    userId: string;
    avatar: string;
    lastName: string;
    firstName: string;
    gender: number;
    phone: string;
    birthday: Date;
    address: string;
    city: string;
    district: string;
    ward: string;
    status: EmployeeStatus,
    roleName: string;
    user: {
        roleId: number;
        email: string;
    }
}

export type EmployeeDetail = EmployeeOverview