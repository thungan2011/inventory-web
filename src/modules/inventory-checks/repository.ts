import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InventoryCheckDetail, InventoryCheckOverview } from '@/modules/inventory-checks/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';


export const INVENTORY_QUERY_KEY = 'inventory-checks';

/**
 * Get all products
 */
interface FetchAllInventoryCheckParams {
    page?: number;
}

const getAllInventoryCheck = (params: FetchAllInventoryCheckParams): Promise<PageObject<InventoryCheckOverview>> => {
    return httpRepository.get<PageObject<InventoryCheckOverview>>('/v1/inventory_checks', { ...params });
};

export const useAllInventoryCheck = (params: FetchAllInventoryCheckParams) => {
    return useQuery({
        queryKey: [INVENTORY_QUERY_KEY, params],
        queryFn: () => getAllInventoryCheck(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create inventory check
 */
interface AddInventoryCheckPayload {
    storage_area_id: number;
    note?: string;
    check_date: string;
}

const createInventoryCheck = (payload: AddInventoryCheckPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/inventory_checks', payload);
};

export const useCreateInventoryCheck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createInventoryCheck,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
            toast.success('Tạo yêu cầu kiểm kho thành công');
        },
        onError: () => {
            toast.error('Tạo yêu cầu kiểm kho không thành công. Thử lại sau.');
        },
    });
};

/**
 * Approve inventory check
 */

const approveInventoryCheck = (id: number): Promise<void> => {
    return httpRepository.put<void>(`/v1/inventory_checks/${id}/approve`);
};

export const useApproveInventoryCheck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveInventoryCheck,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
            toast.success('Phê duyệt thành công');
        },
        onError: () => {
            toast.error('Phê duyệt không thành công. Thử lại sau.');
        },
    });
};

/**
 * get inventory check by id
 */
const getInventoryCheckById = (id: string | number): Promise<InventoryCheckDetail> => {
    return httpRepository.get<InventoryCheckDetail>(`/v1/inventory_checks/${id}`);
};

export const useInventoryCheckById = (id: string | number) => {
    return useDataFetching(
        [INVENTORY_QUERY_KEY, id],
        () => getInventoryCheckById(id),
        { enabled: !!id },
    );
};

/**
 * Update inventory check
 */

interface UpdateInventoryCheckPayload {
    details: {
        history_id: number;
        actual_quantity: number;
        reason: string
    }[];
}

const updateInventoryCheck = ({ id, payload }: { id: number; payload: UpdateInventoryCheckPayload }): Promise<void> => {
    return httpRepository.post<void, UpdateInventoryCheckPayload>(`/v1/inventory_checks/${id}/details`, payload);
};

export const useUpdateInventoryCheck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateInventoryCheck,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
            toast.success('Thành công');
        },
        onError: () => {
            toast.error('Không thành công. Thử lại sau.');
        },
    });
};