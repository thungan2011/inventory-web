import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { OrderDetail, OrderOverview } from '@/modules/orders/interface';
import useDataFetching from '@/hook/useDataFetching';

export const ORDER_QUERY_KEY = 'orders';

/**
 * Get all orders
 */
interface FetchAllOrderParams {
    page?: number;
}

const getAllOrders = (params: FetchAllOrderParams): Promise<PageObject<OrderOverview>> => {
    return httpRepository.get<PageObject<OrderOverview>>('/v1/orders', {
        page: params.page || 1,
    });
};

export const useAllOrders = (params: FetchAllOrderParams) => {
    return useQuery({
        queryKey: [ORDER_QUERY_KEY, params],
        queryFn: () => getAllOrders(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * get orders by CODE
 */
const getOrderByCode = (code: string): Promise<OrderDetail> => {
    return httpRepository.get<OrderDetail>(`/v1/orders/${code}`);
};

export const useOrderByCode = (code: string) => {
    return useDataFetching(
        [ORDER_QUERY_KEY, code],
        () => getOrderByCode(code),
        { enabled: !!code },
    );
};