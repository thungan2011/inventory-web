import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { ProductHistoryOverview } from '@/modules/product-histories/inteface';

export const PRODUCT_HISTORY_QUERY_KEY = 'product-histories';

/**
 * Get all product histories
 */
interface FetchAllProductHistoryParams {
    page?: number;
    search_product?: string;
}

const getAllProductHistories = (params: FetchAllProductHistoryParams): Promise<PageObject<ProductHistoryOverview>> => {
    return httpRepository.get<PageObject<ProductHistoryOverview>>('/v1/product_storage_history_details', { ...params });
};

export const useAllProductHistories = (params: FetchAllProductHistoryParams) => {
    return useQuery({
        queryKey: [PRODUCT_HISTORY_QUERY_KEY, params],
        queryFn: () => getAllProductHistories(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};