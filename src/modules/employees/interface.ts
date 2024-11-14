import { GenderStatus } from '@/components/Badge/GenderStatusBadge';

export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
export interface EmployeeOverview {
    id: string;
    userId: string;
    avatar: string;
    lastName: string;
    firstName: string;
    gender: GenderStatus;
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