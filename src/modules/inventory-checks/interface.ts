import { StorageAreaType } from '@/modules/storage-area/interface';

export interface InventoryCheckOverview {
    id: number;
    checkDate: Date;
    note: string;
    status: InventoryCheckStatus;
    storageArea: {
        id: number;
        code: string;
        name: string;
        type: StorageAreaType;
    };
}

export interface InventoryCheckDetail {
    id: number;
    checkDate: Date;
    note: string;
    status: InventoryCheckStatus;
    storageArea: {
        id: number;
        code: string;
        name: string;
        type: StorageAreaType;
    };
}

export enum InventoryCheckStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    COMPLETED = 'COMPLETED',
}

export const InventoryCheckStatusVietnamese : Record<InventoryCheckStatus, string> = {
    [InventoryCheckStatus.PENDING]: 'Chờ duyệt',
    [InventoryCheckStatus.APPROVED]: 'Đã duyệt',
    [InventoryCheckStatus.COMPLETED]: 'Đã kiểm'
};