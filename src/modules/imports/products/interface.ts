/**
 * Loại nhập kho
 */
export enum ImportProductType {
    NORMAL = 'NORMAL',
    RETURN = 'RETURN',
    OTHER = 'OTHER'
}

export const ImportProductTypesVietnamese : Record<ImportProductType, string> = {
    [ImportProductType.NORMAL]: "Xưởng sản xuất",
    [ImportProductType.RETURN]: "Hàng bán trả về",
    [ImportProductType.OTHER]: "Khác"
};

/**
 * Các trạng thái nhập kho
 */
export enum ImportProductStatus {
    COMPLETED = 'COMPLETED',
    TEMPORARY = 'TEMPORARY',
}

export const ImportProductStatusVietnamese : Record<ImportProductStatus, string> = {
    [ImportProductStatus.COMPLETED]: 'Đã nhập',
    [ImportProductStatus.TEMPORARY]: 'Phiếu tạm'
};

export interface ImportProductOverview {
    id: string;
    code: string;
    createdAt: Date;
    name: string;
    type: ImportProductType;
    note: string;
    status: ImportProductStatus;
    creator: {
        fullName: string;
    },
    receiver: {
        fullName: string;
    }
}