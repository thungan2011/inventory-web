/**
 * Loại nhập kho
 */
export enum ExportProductType {
    NORMAL = 'NORMAL',
    CANCEL = 'CANCEL',
    OTHER = 'OTHER',
}

export const ExportProductTypeVietnamese : Record<ExportProductType, string> = {
    [ExportProductType.NORMAL]: "Bán hàng",
    [ExportProductType.CANCEL]: "Xuất hủy",
    [ExportProductType.OTHER]: "Khác",
};

/**
 * Các trạng thái nhập kho
 */
export enum ExportProductStatus {
    TEMPORARY = 'TEMPORARY',
    COMPLETED = 'COMPLETED'
}

export const ExportProductStatusVietnamese : Record<ExportProductStatus, string> = {
    [ExportProductStatus.TEMPORARY]: 'Phiếu tạm',
    [ExportProductStatus.COMPLETED]: 'Đã xuất'
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