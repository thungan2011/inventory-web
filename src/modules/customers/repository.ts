import httpRepository from '@/core/repository/http';
import { CustomerDetail, CustomerOverview, CustomerStatus } from '@/modules/customers/interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const CUSTOMER_QUERY_KEY = 'customers';

/**
 * Get all customers
 */
interface FetchAllCustomerParams {
    page?: number;
    name: string;
    code: string;
    status?: CustomerStatus;
    phone: string;
}

const getAllCustomers = (params: FetchAllCustomerParams): Promise<PageObject<CustomerOverview>> => {
    return httpRepository.get<PageObject<CustomerOverview>>('/v1/customers', {
        page: params.page || 1,
        name: params.name,
        code: params.code,
        status: params.status,
        phone: params.phone,
    });
};

export const useAllCustomers = (params: FetchAllCustomerParams) => {
    return useQuery({
        queryKey: [CUSTOMER_QUERY_KEY, params],
        queryFn: () => getAllCustomers(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create customer
 */
interface AddCustomerPayload {
    code?: string;
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    email?: string;
    status: CustomerStatus;
    note: string;
}

const createCustomer = (payload: AddCustomerPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/customers', payload);
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCustomer,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
            toast.success('Thêm khách hàng thành công');
        },
        onError: () => {
            toast.error('Thêm khách hàng không thành công. Thử lại sau.');
        },
    });
};

/**
 * delete customer
 */
const deleteCustomer = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/customers/${id}`);
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCustomer,
        mutationKey: [CUSTOMER_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
            toast.success('Xóa khách hàng thành công');
        },
        onError: () => {
            toast.error('Xóa khách hàng không thành công. Thử lại sau.');
        },
    });
};
/**
 * get customer by ID
 */
const getCustomerByCode = (code: string): Promise<CustomerDetail> => {
    return httpRepository.get<CustomerDetail>(`/v1/customers/${code}`);
};

export const useCustomerByCode = (code: string) => {
    return useDataFetching(
        [CUSTOMER_QUERY_KEY, code],
        () => getCustomerByCode(code),
        {enabled: !!code}
    );
};