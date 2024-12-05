export enum ProductActionType {
    EXPORT_NORMAL = 'EXPORT_NORMAL',
    EXPORT_CANCEL = 'EXPORT_CANCEL',
    IMPORT_NORMAL = 'IMPORT_NORMAL',
    IMPORT_RETURN = 'IMPORT_RETURN',
}

export const ProductActionTypeVietnamese : Record<ProductActionType, string> = {
    [ProductActionType.EXPORT_NORMAL]: 'Xuất cho bán hàng',
    [ProductActionType.EXPORT_CANCEL]: 'Xuất hủy',
    [ProductActionType.IMPORT_NORMAL]: 'Nhập từ sản xuất',
    [ProductActionType.IMPORT_RETURN]: 'Nhập hoàn trả từ bán hàng',
};

import { StorageAreaType } from '@/modules/storage-area/interface';

export interface ProductHistoryOverview {
    id: number;
    quantityBefore: number;
    quantityAfter: number;
    quantityChange: number;
    createdAt: Date;
    actionType: ProductActionType;
    productStorageHistory: {
        id: number;
        product: {
            id: number;
            sku: string;
            unit: string;
            name: string;
            origin: string;
            weight: number;
            packing: string;
            image: string;
            quantityAvailable: number;
        },
        storageArea: {
            id: number;
            name: string;
            code: string;
            type: StorageAreaType;
        }
    };
}