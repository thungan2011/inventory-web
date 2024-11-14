import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StorageAreaOverview, StorageAreaStatus } from '@/modules/storage-area/interface';
import { toast } from 'react-toastify';


export const STORAGE_AREA_QUERY_KEY = 'storage-area-list';

/**
 * Get all storage area list
 */

interface FetchAllWarehouseAreaListParams {
    page?: number;
    name: string;
    status?: StorageAreaStatus;
    code: string;
}

const getAllStorageAreas = (params: FetchAllWarehouseAreaListParams): Promise<PageObject<StorageAreaOverview>> => {
    return httpRepository.get<PageObject<StorageAreaOverview>>('/v1/storage_areas', {
        page: params.page || 1,
        name: params.name,
        status: params.status,
        code: params.code,
    });
};

export const useAllStorageAreas = (params: FetchAllWarehouseAreaListParams) => {
    return useQuery({
        queryKey: [STORAGE_AREA_QUERY_KEY, params],
        queryFn: () => getAllStorageAreas(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create storage area list
 */
interface AddStorageAreaPayload {
    name: string;
    status: StorageAreaStatus;
    code: string;
    description: string;
}

const createStorageArea = (payload: AddStorageAreaPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/storage_areas', payload);
};

export const useCreateStorageArea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStorageArea,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [STORAGE_AREA_QUERY_KEY] });
            toast.success('Thêm danh mục thành công');
        },
        onError: () => {
            toast.error('Thêm danh mục không thành công. Thử lại sau.');
        },
    });
};

/**
 * delete storage area
 */
const deleteStorageArea = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/storage_areas/${id}`);
};

export const useDeleteStorageArea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStorageArea,
        mutationKey: [STORAGE_AREA_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [STORAGE_AREA_QUERY_KEY] });
            toast.success('Xóa khu vực lưu kho thành công');
        },
        onError: (error: any) => {
            console.table(error?.error);
            toast.error(error.error || 'Xóa khu vực lưu kho không thành công. Thử lại sau.');
        },
    });
};

/**
 * update category
 */
interface UpdateStorageAreaPayload {
    name: string;
    status: StorageAreaStatus;
    code: string;
    description: string;
}

const updateStorageArea = ({id, payload} : {payload: UpdateStorageAreaPayload, id: number}): Promise<void> => {
    return httpRepository.put<void>(`/v1/storage_areas/${id}`, payload);
};

export const useUpdateStorageArea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStorageArea,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [STORAGE_AREA_QUERY_KEY] });
            toast.success('Cập nhật khu vực lưu kho thành công');
        },
        onError: () => {
            toast.error('Cập nhật khu vực lưu kho không thành công. Thử lại sau.');
        },
    });
};

