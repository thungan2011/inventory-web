import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderDetail, OrderOverview, OrderStatus, PaymentMethod } from '@/modules/orders/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

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

/**
 * Create order
 */
interface AddOrderPayload {
    customerId: number;
    status: OrderStatus;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    deliveryDate: Date;
    paymentMethod: PaymentMethod;
    product: {
        productId: number;
        quantity: number;
    }[]
}

const createOrder = (payload: AddOrderPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/orders', payload);
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
            toast.success('Thêm đơn hàng thành công');
        },
        onError: () => {
            toast.error('Thêm đơn hàng không thành công. Thử lại sau.');
        },
    });
};