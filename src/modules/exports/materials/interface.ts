/**
 * Loại nhập kho
 */
export enum ExportMaterialType {
    NORMAL = 'NORMAL',
    RETURN = 'RETURN',
    CANCEL = 'CANCEL',
    OTHER = 'OTHER',
}

export const ExportMaterialTypeVietnamese : Record<ExportMaterialType, string> = {
    [ExportMaterialType.NORMAL]: "Sản xuất",
    [ExportMaterialType.RETURN]: "Trả hàng",
    [ExportMaterialType.CANCEL]: "Xuất hủy",
    [ExportMaterialType.OTHER]: "Khác"
};

/**
 * Các trạng thái nhập kho
 */
export enum ExportMaterialStatus {
    TEMPORARY = 'TEMPORARY',
    COMPLETED = 'COMPLETED'
}

export const ExportMaterialStatusVietnamese : Record<ExportMaterialStatus, string> = {
    [ExportMaterialStatus.TEMPORARY]: 'Phiếu tạm',
    [ExportMaterialStatus.COMPLETED]: 'Hoàn thành'
};

export interface ExportMaterialOverview {
    id: string;
    code: string;
    createdBy: string;
    createdAt: Date;
    type: ExportMaterialType;
    note: string;
    status: ExportMaterialStatus;
    creator: {
        fullName: string;
    },
}

export interface ExportMaterialDetail{
    id: string;
    code: string;
    createdAt: Date;
    type: ExportMaterialType;
    note: string;
    status: ExportMaterialStatus;
    creator: {
        fullName: string;
        email: string;
    };
    details: {
        quantity: number;
        expiryDate: Date;
        material: {
            id: number;
            sku: string;
            name: string;
            weight: number;
            packing: string;
            unit:string;
            origin: string;
        }
        storageArea: {
            code: string;
            name: string;
        }
    }[]
}