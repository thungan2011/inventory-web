import { CustomerStatus } from '@/modules/customers/interface';

export interface GroupCustomerOverview {
    id: number;
    name: string;
    status: CustomerStatus,
}