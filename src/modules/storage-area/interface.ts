export enum StorageAreaStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface StorageAreaOverview {
    id: number;
    code: string;
    name: string;
    description: string;
    status: StorageAreaStatus;
}