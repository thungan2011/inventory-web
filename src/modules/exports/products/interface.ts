/**
 * Loại nhập kho
 */
export enum ExportProductType {
    NORMAL = 'NORMAL',
    CANCEL = 'CANCEL',
    OTHER = 'OTHER',
}

export const ExportProductTypeVietnamese: Record<ExportProductType, string> = {
    [ExportProductType.NORMAL]: 'Bán hàng',
    [ExportProductType.CANCEL]: 'Xuất hủy',
    [ExportProductType.OTHER]: 'Khác',
};

/**
 * Các trạng thái nhập kho
 */
export enum ExportProductStatus {
    TEMPORARY = 'TEMPORARY',
    COMPLETED = 'COMPLETED'
}

export const ExportProductStatusVietnamese: Record<ExportProductStatus, string> = {
    [ExportProductStatus.TEMPORARY]: 'Phiếu tạm',
    [ExportProductStatus.COMPLETED]: 'Đã xuất',
};

export interface ExportProductOverview {
    id: string;
    code: string;
    createdBy: string;
    createdAt: Date;
    type: ExportProductType;
    note: string;
    status: ExportProductStatus;
    creator: {
        fullName: string;
    },
}

export interface ExportProductDetail {
    id: string;
    code: string;
    createdAt: Date;
    type: ExportProductType;
    note: string;
    status: ExportProductStatus;
    creator: {
        fullName: string;
        email: string;
    };
    details: {
        quantity: number;
        expiryDate: Date;
        product: {
            id: number;
            sku: string;
            name: string;
            weight: number;
            packing: string;
            unit: string;
            image: string;
        };
        storageArea: {
            id: number;
            name: string;
            code: string;
        }
    }[];
}