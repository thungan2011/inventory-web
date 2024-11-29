import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import {
    ExportMaterialDetail,
    ExportMaterialOverview,
    ExportMaterialStatus,
    ExportMaterialType,
} from '@/modules/exports/materials/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

export const EXPORT_MATERIAL_QUERY_KEY = 'export_materials';

/**
 * Get all Export Materials
 */
interface FetchAllExportMaterialParams {
    page?: number;
    code: string;
    type?: ExportMaterialType;
    status?: ExportMaterialStatus;
}

const getAllExportMaterials = (params: FetchAllExportMaterialParams): Promise<PageObject<ExportMaterialOverview>> => {
    return httpRepository.get<PageObject<ExportMaterialOverview>>('/v1/material_export_receipts', {
        page: params.page || 1,
        code: params.code,
        type: params.type,
        status: params.status,
    });
};

export const useAllExportMaterials = (params: FetchAllExportMaterialParams) => {
    return useQuery({
        queryKey: [EXPORT_MATERIAL_QUERY_KEY, params],
        queryFn: () => getAllExportMaterials(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * get export material by Code
 */
const getExportMaterialByCode = (code: string): Promise<ExportMaterialDetail> => {
    return httpRepository.get<ExportMaterialDetail>(`/v1/material_export_receipts/${code}`);
};

export const useExportMaterialByCode = (code: string) => {
    return useDataFetching(
        [EXPORT_MATERIAL_QUERY_KEY, code],
        () => getExportMaterialByCode(code),
        { enabled: !!code },
    );
};

/**
 * Create export material
 */
interface AddExportMaterialPayload {
    sku?: string;
    name: string;
    type: ExportMaterialType;
    note: string;
}

const createExportMaterial = (payload: AddExportMaterialPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/export/materials', payload);
};

export const useCreatExportMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createExportMaterial,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [EXPORT_MATERIAL_QUERY_KEY] });
            toast.success('Xuất kho nguyên vật liệu thành công');
        },
        onError: () => {
            toast.error('Xuất kho nguyên vật liệu không thành công. Thử lại sau.');
        },
    });
};