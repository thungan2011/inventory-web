import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { OrderOverview } from '@/modules/orders/interface';

export const ORDER_QUERY_KEY = 'orders';

/**
 * Get all orders
 */
interface FetchAllOrderParams {
    page?: number;
}

const getAllOrders = (params: FetchAllOrderParams) : Promise<PageObject<OrderOverview>> => {
    return httpRepository.get<PageObject<OrderOverview>>('/v1/orders', {
        page: params.page || 1,
    });
};

export const useAllOrders = (params: FetchAllOrderParams)  => {
    return useQuery({
        queryKey: [ORDER_QUERY_KEY, params],
        queryFn: () => getAllOrders(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};