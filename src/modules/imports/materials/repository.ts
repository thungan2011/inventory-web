import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ImportMaterialDetail, ImportMaterialOverview } from '@/modules/imports/materials/interface';
import useDataFetching from '@/hook/useDataFetching';

export const IMPORT_MATERIAL_QUERY_KEY = 'import_materials';

/**
 * Get all Import Materials
 */
interface FetchAllImportMaterialParams {
    page?: number;
}

const getAllImportMaterials = (params: FetchAllImportMaterialParams): Promise<PageObject<ImportMaterialOverview>> => {
    return httpRepository.get<PageObject<ImportMaterialOverview>>('/v1/material_import_receipts', {
        page: params.page || 1,
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
        {enabled: !!code}
    );
};