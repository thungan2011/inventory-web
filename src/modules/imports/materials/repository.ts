import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import {
    ImportMaterialDetail,
    ImportMaterialOverview,
    ImportMaterialStatus,
    ImportMaterialType,
} from '@/modules/imports/materials/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

export const IMPORT_MATERIAL_QUERY_KEY = 'import_materials';

/**
 * Get all Import Materials
 */
interface FetchAllImportMaterialParams {
    page?: number;
    code: string;
    type?: ImportMaterialType;
    status?: ImportMaterialStatus;
}

const getAllImportMaterials = (params: FetchAllImportMaterialParams): Promise<PageObject<ImportMaterialOverview>> => {
    return httpRepository.get<PageObject<ImportMaterialOverview>>('/v1/material_import_receipts', {
        page: params.page || 1,
        code: params.code,
        type: params.type,
        status: params.status,
    });
};

export const useAllImportMaterials = (params: FetchAllImportMaterialParams) => {
    return useQuery({
        queryKey: [IMPORT_MATERIAL_QUERY_KEY, params],
        queryFn: () => getAllImportMaterials(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * get import material by Code
 */
const getImportMaterialByCode = (code: string): Promise<ImportMaterialDetail> => {
    return httpRepository.get<ImportMaterialDetail>(`/v1/material_import_receipts/${code}`);
};

export const useImportMaterialByCode = (code: string) => {
    return useDataFetching(
        [IMPORT_MATERIAL_QUERY_KEY, code],
        () => getImportMaterialByCode(code),
        { enabled: !!code },
    );
};

/**
 * Create import material
 */
interface AddImportMaterialPayload {
    provider_id?: number;
    receiver_id?: number;
    type: ImportMaterialType;
    note: string;
    materials: {
        material_id: number;
        quantity: number;
        price: number;
        expiry_date: string;
        storage_area_id: number;
    }[];
}

const createImportMaterial = (payload: AddImportMaterialPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/import/materials', payload);
};

export const useCreateImportMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createImportMaterial,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [IMPORT_MATERIAL_QUERY_KEY] });
            toast.success('Nhập kho nguyên vật liệu thành công');
        },
        onError: () => {
            toast.error('Nhập kho nguyên vật liệu không thành công. Thử lại sau.');
        },
    });
};