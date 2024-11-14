export enum StockInventoryMaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface StockInventoryMaterialOverview {
    id: string;
    name: string;
    check_date: Date;
    check_by: string;
    status: StockInventoryMaterialStatus;
}