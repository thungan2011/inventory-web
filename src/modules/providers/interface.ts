import { BaseStatus } from '@/modules/base/interface';

export interface ProviderOverview {
    id: number;
    code: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    website: string;
    note: string;
    district: string;
    ward: string;
    status: BaseStatus,
    representativeName: string;
    representativePhone: string;
    representativeEmail: string;
}

export interface ProviderDetail extends ProviderOverview {
    materials: {
        id: number;
        name: string;
    } [];
}