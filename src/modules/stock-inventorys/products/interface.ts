export enum StockInventoryProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface StockInventoryProductOverview {
    id: string;
    name: string;
    check_date: Date;
    check_by: string;
    status: StockInventoryProductStatus;
}