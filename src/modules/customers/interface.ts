export enum CustomerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface CustomerOverview {
    id: number;
    code: string;
    name: string;
    phone: string;
    gender: number;
    birthday?: Date;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
    status: CustomerStatus,
    note: string;
    groupCustomer: {
        name: string;
    }
}

export type CustomerDetail = CustomerOverview