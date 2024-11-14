import { BaseStatus } from '@/modules/base/interface';

export enum CategoryType {
    MATERIAL = 'MATERIAL',
    PRODUCT = 'PRODUCT',
}
export const CategoryTypeVietnamese : Record<CategoryType, string> = {
    [CategoryType.PRODUCT]: 'Sản phẩm',
    [CategoryType.MATERIAL]: 'Nguyên vật liệu',
};

export interface CategoryOverview {
    id: number;
    code: string;
    name: string;
    type: CategoryType;
    status: BaseStatus;
    description: string;
    totalProduct: number;
    totalMaterial: number;
}

export interface CategoryWithNameAndType {
    id: number;
    name: string;
    type: CategoryType;
}