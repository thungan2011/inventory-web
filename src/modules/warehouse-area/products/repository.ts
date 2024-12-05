import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { WarehouseAreaProductOverview, WarehouseAreaProductStatus } from '@/modules/warehouse-area/products/interface';


export const WAREHOUSE_AREA_PRODUCT_QUERY_KEY = 'warehouse-area-product';

/**
 * Get all Warehouse Areas Product
 */

interface FetchAllWarehouseAreaProductParams {
    page?: number;
    status?: WarehouseAreaProductStatus;
    search?: string;
    search_product?: string;
}

const getAllWarehouseAreaProducts = (params: FetchAllWarehouseAreaProductParams): Promise<PageObject<WarehouseAreaProductOverview>> => {
    return httpRepository.get<PageObject<WarehouseAreaProductOverview>>('/v1/product_storage_history', {...params});
};

export const useAllWarehouseAreaProducts = (params: FetchAllWarehouseAreaProductParams) => {
    return useQuery({
        queryKey: [WAREHOUSE_AREA_PRODUCT_QUERY_KEY, params],
        queryFn: () => getAllWarehouseAreaProducts(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

