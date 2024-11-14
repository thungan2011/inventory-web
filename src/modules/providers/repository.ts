import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ProviderDetail, ProviderOverview } from '@/modules/providers/interface';
import { BaseStatus } from '@/modules/base/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const PROVIDER_QUERY_KEY = 'providers';

/**
 * Get all providers
 */
interface FetchAllProviderParams {
    page?: number;
    name: string;
    code: string;
    status?: BaseStatus;
    phone: string;
}

const getAllProviders = (params: FetchAllProviderParams) : Promise<PageObject<ProviderOverview>> => {
    return httpRepository.get<PageObject<ProviderOverview>>('/v1/providers', {
        page: params.page || 1,
        name: params.name,
        code: params.code,
        status: params.status,
        phone: params.phone,
    });
};

export const useAllProviders = (params: FetchAllProviderParams)  => {
    return useQuery({
        queryKey: [PROVIDER_QUERY_KEY, params],
        queryFn: () => getAllProviders(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create provider
 */
interface AddProviderPayload {
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    email?: string;
    website?: string;
    status: BaseStatus;
    representative_name: string;
    representative_phone: string;
    representative_email?: string;
    note: string;
}

const createProvider = (payload: AddProviderPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/providers', payload);
};

export const useCreateProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProvider,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PROVIDER_QUERY_KEY] });
            toast.success('Thêm nhà cung cấp thành công');
        },
        onError: () => {
            toast.error("Thêm nhà cung cấp không thành công. Thử lại sau.");
        }
    });
};

/**
 * delete provider
 */
const deleteCustomer = (code: number) : Promise<void> => {
    return httpRepository.delete<void>(`/v1/providers/${code}`);
};

export const useDeleteProvider = ()  => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCustomer,
        mutationKey: [PROVIDER_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PROVIDER_QUERY_KEY] });
            toast.success('Xóa nhà cung cấp thành công');
        },
        onError: () => {
            toast.error("Xóa nhà cung cấp không thành công. Thử lại sau.");
        }
    });
};

/**
 * get provider by ID
 */
const getProviderByCode = (code: string): Promise<ProviderDetail> => {
    return httpRepository.get<ProviderDetail>(`/v1/providers/${code}`);
};

export const useProviderByCode = (code: string) => {
    return useDataFetching(
        [PROVIDER_QUERY_KEY, code],
        () => getProviderByCode(code),
        {enabled: !!code}
    );
};
