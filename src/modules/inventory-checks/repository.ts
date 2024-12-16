import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { InventoryCheckOverview } from '@/modules/inventory-checks/interface';


export const INVENTORY_QUERY_KEY = 'inventory-checks';

/**
 * Get all products
 */
interface FetchAllInventoryCheckParams {
    page?: number;
}

const getAllInventoryCheck = (params: FetchAllInventoryCheckParams): Promise<PageObject<InventoryCheckOverview>> => {
    return httpRepository.get<PageObject<InventoryCheckOverview>>('/v1/inventory_checks', {...params});
};

export const useAllInventoryCheck = (params: FetchAllInventoryCheckParams) => {
    return useQuery({
        queryKey: [INVENTORY_QUERY_KEY, params],
        queryFn: () => getAllInventoryCheck(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};