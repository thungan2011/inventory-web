import { StorageAreaType } from '@/modules/storage-area/interface';

export enum MaterialActionType {
    EXPORT_NORMAL = 'EXPORT_NORMAL',
    EXPORT_RETURN = 'EXPORT_RETURN',
    IMPORT_NORMAL = 'IMPORT_NORMAL',
    IMPORT_RETURN = 'IMPORT_RETURN',
}

export const MaterialActionTypeVietnamese : Record<MaterialActionType, string> = {
    [MaterialActionType.EXPORT_NORMAL]: 'Xuất cho sản xuất',
    [MaterialActionType.EXPORT_RETURN]: 'Xuất trả nhà cung cấp',
    [MaterialActionType.IMPORT_NORMAL]: 'Nhập từ nhà cung cấp',
    [MaterialActionType.IMPORT_RETURN]: 'Nhập hoàn trả từ sản xuất',
};

export interface MaterialHistoryOverview {
    id: number;
    quantityBefore: number;
    quantityAfter: number;
    quantityChange: number;
    createdAt: Date;
    actionType: MaterialActionType;
    materialStorageHistory: {
        id: number;
        material: {
            id: number;
            sku: string;
            name: string;
            unit: string;
            weight: number;
            packing: string;

        },
        storageArea: {
            id: number;
            name: string;
            code: string;
            type: StorageAreaType;
        }
    };
}