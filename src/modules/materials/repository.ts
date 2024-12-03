import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MaterialDetail, MaterialOverview, MaterialStatus } from '@/modules/materials/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';


export const MATERIAL_QUERY_KEY = 'materials';

/**
 * Get all material
 */
interface FetchAllMaterialParams {
    page?: number;
    name?: string;
    status?: MaterialStatus;
    origin?: string;
}

const getAllMaterials = (params: FetchAllMaterialParams): Promise<PageObject<MaterialOverview>> => {
    return httpRepository.get<PageObject<MaterialOverview>>('/v1/materials', {
        page: params.page || 1,
        name: params.name,
        status: params.status,
        origin: params.origin,
    });
};

export const useAllMaterials = (params: FetchAllMaterialParams) => {
    return useQuery({
        queryKey: [MATERIAL_QUERY_KEY, params],
        queryFn: () => getAllMaterials(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};


/**
 * Create material
 */
interface AddMaterialPayload {
    sku?: string;
    name: string;
    category_id: number[];
    origin: string;
    status: MaterialStatus;
    weight: number;
    unit: string;
    packing: string;
    note?: string;
    minimum_stock_level: number;
    maximum_stock_level?: number;
}

const createMaterial = (payload: AddMaterialPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/materials', payload);
};

export const useCreateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMaterial,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [MATERIAL_QUERY_KEY] });
            toast.success('Thêm nguyên vật liệu thành công');
        },
        onError: () => {
            toast.error('Thêm nguyên vật liệu không thành công. Thử lại sau.');
        },
    });
};

/**
 * delete material
 */
const deleteMaterial = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/materials/${id}`);
};

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMaterial,
        mutationKey: [MATERIAL_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [MATERIAL_QUERY_KEY] });
            toast.success('Xóa nguyên vật liệu thành công');
        },
        onError: () => {
            toast.error('Xóa nguyên vật liệu không thành công. Thử lại sau.');
        },
    });
};
/**
 * get material by SKU
 */
const getMaterialBySKU = (sku: string): Promise<MaterialDetail> => {
    return httpRepository.get<MaterialDetail>(`/v1/materials/sku/${sku}`);
};

export const useMaterialBySKU = (sku: string) => {
    return useDataFetching(
        [MATERIAL_QUERY_KEY, sku],
        () => getMaterialBySKU(sku),
        {enabled: !!sku}
    );
};

/**
 * update material
 */
interface UpdateMaterialPayload {
    sku?: string;
    name: string;
    category_id: number[];
    origin: string;
    status: MaterialStatus;
    weight: number;
    unit: string;
    packing: string;
    note?: string;
    minimum_stock_level?: number;
    maximum_stock_level?: number;
}

const updateMaterial = ({id, payload} : {payload: UpdateMaterialPayload, id: number}): Promise<void> => {
    return httpRepository.put<void>(`/v1/materials/${id}`, payload);
};

export const useUpdateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMaterial,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [MATERIAL_QUERY_KEY] });
            toast.success('Cập nhật nguyên vật liệu thành công');
        },
        onError: () => {
            toast.error('Cập nhật nguyên vật liệu không thành công. Thử lại sau.');
        },
    });
};