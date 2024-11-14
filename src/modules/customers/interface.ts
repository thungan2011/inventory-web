import { GenderStatus } from '@/components/Badge/GenderStatusBadge';

export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface CustomerOverview {
    id: number;
    code: string;
    name: string;
    phone: string;
    gender: GenderStatus;
    birthday?: Date;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
    status: CustomerStatus,
    note: string;
}

export type CustomerDetail = CustomerOverview