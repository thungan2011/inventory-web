import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { MaterialHistoryOverview } from '@/modules/material-histories/inteface';

export const MATERIAL_HISTORY_QUERY_KEY = 'material-histories';

/**
 * Get all material histories
 */
interface FetchAllMaterialHistoryParams {
    page?: number;
    search_material?: string;
}

const getAllMaterialHistories = (params: FetchAllMaterialHistoryParams): Promise<PageObject<MaterialHistoryOverview>> => {
    return httpRepository.get<PageObject<MaterialHistoryOverview>>('/v1/material_storage_history_details', {...params});
};

export const useAllMaterialHistories = (params: FetchAllMaterialHistoryParams) => {
    return useQuery({
        queryKey: [MATERIAL_HISTORY_QUERY_KEY, params],
        queryFn: () => getAllMaterialHistories(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};