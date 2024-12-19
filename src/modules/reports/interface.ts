export interface Report {
    summary: {
        totalProduct: number;
        totalMaterial: number;
        todayRevenue: number;
        pendingImports: number;
        totalEmployee: number;
        totalCustomer: number;
    };
    revenue: {
        totalRevenue: number;
        date: string;
    }[];
    productStats: {
        name: string;
        totalRevenue: number;
    }[];
}