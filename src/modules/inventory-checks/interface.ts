export interface InventoryCheckOverview {
    id: number;
    checkDate: Date;
    note: string;
    status: InventoryCheckStatus;
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