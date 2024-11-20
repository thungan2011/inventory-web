import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ExportMaterialDetail, ExportMaterialOverview } from '@/modules/exports/materials/interface';
import useDataFetching from '@/hook/useDataFetching';

export const EXPORT_MATERIAL_QUERY_KEY = 'export_materials';

/**
 * Get all Export Materials
 */
interface FetchAllExportMaterialParams {
    page?: number;
}

const getAllExportMaterials = (params: FetchAllExportMaterialParams): Promise<PageObject<ExportMaterialOverview>> => {
    return httpRepository.get<PageObject<ExportMaterialOverview>>('/v1/material_export_receipts', {
        page: params.page || 1,
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
        {enabled: !!code}
    );
};