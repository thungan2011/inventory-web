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
    status?: OrderStatus;
    customer_name?: string;
    code?: string;
    phone?: string;
}

const getAllOrders = (params: FetchAllOrderParams): Promise<PageObject<OrderOverview>> => {
    return httpRepository.get<PageObject<OrderOverview>>('/v1/orders', {...params});
};

export const useAllOrders = (params: FetchAllOrderParams) => {
    return useQuery({
        queryKey: [ORDER_QUERY_KEY, params],
        queryFn: () => getAllOrders(params),
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
    customer_id: number;
    status: OrderStatus;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    delivery_date: string;
    payment_method: PaymentMethod;
    products: {
        product_id: number;
        quantity: number;
    }[];
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
            toast.success('Tạo đơn hàng thành công');
        },
        onError: () => {
            toast.error('Thêm đơn hàng không thành công. Thử lại sau.');
        },
    });
};

/**
 * update order
 */
interface UpdateOrderPayload {
    customer_id: number;
    status: OrderStatus;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    delivery_date: string;
    payment_method: PaymentMethod;
    products: {
        product_id: number;
        quantity: number;
    }[];
}

const updateOrder = ({ id, payload }: { payload: UpdateOrderPayload, id: number }): Promise<void> => {
    return httpRepository.put<void>(`/v1/orders/${id}`, payload);
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
            toast.success('Cập nhật đơn hàng thành công');
        },
        onError: () => {
            toast.error('Cập nhật đơn hàng không thành công. Thử lại sau.');
        },
    });
};