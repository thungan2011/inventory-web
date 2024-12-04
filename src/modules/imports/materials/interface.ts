/**
 * Loại nhập kho
 */
export enum ImportMaterialType {
    NORMAL = 'NORMAL',
    RETURN = 'RETURN',
    OTHER = 'OTHER'
}

export const ImportMaterialTypeVietnamese: Record<ImportMaterialType, string> = {
    [ImportMaterialType.NORMAL]: 'Từ nhà cung cấp',
    [ImportMaterialType.RETURN]: 'Nguyên vật liệu thừa',
    [ImportMaterialType.OTHER]: 'Khác',
};

/**
 * Các trạng thái nhập kho
 */
export enum ImportMaterialStatus {
    PENDING_APPROVED = 'PENDING_APPROVED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED'
}

export const ImportMaterialStatusVietnamese: Record<ImportMaterialStatus, string> = {
    [ImportMaterialStatus.PENDING_APPROVED]: 'Chờ duyệt',
    [ImportMaterialStatus.APPROVED]: 'Đã duyệt',
    [ImportMaterialStatus.REJECTED]: 'Bị từ chối',
    [ImportMaterialStatus.COMPLETED]: 'Đã nhập',
};

export interface ImportMaterialOverview {
    id: string;
    code: string;
    createdAt: Date;
    type: ImportMaterialType;
    note: string;
    status: ImportMaterialStatus;
    provider: {
        name: string;
        phone: string;
    };
    creator: {
        fullName: string;
    };
}

export interface ImportMaterialDetail{
    id: string;
    code: string;
    createdAt: Date;
    type: ImportMaterialType;
    note: string;
    status: ImportMaterialStatus;
    provider?: {
        id: number;
        code: string;
        name: string;
        address: string;
        city: string;
        ward: string;
        district: string;
        phone: string;
        email: string;
    };
    creator: {
        fullName: string;
        email: string;
    };
    receiver: {
        fullName: string;
        email: string;
    },
    details: {
        quantity: number;
        price: number;
        expiryDate: Date;
        material: {
            id: number;
            sku: string;
            name: string;
            weight: number;
            packing: string;
            unit:string;
            origin: string;
        };
        storageArea: {
            code: string;
            name: string;
        }
    }[]
}