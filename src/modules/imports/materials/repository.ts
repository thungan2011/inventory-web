import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ImportMaterialOverview } from '@/modules/imports/materials/interface';

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