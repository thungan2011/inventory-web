import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { ComboOverview } from '@/modules/combos/interface';

export const COMBO_QUERY_KEY = 'combos';

/**
 * Get all combos
 */
interface FetchAllComboParams {
    page?: number;
}

const getAllCombos = (params: FetchAllComboParams) : Promise<PageObject<ComboOverview>> => {
    return httpRepository.get<PageObject<ComboOverview>>('/v1/gift_sets', {
        page: params.page || 1,
    });
};

export const useAllCombos = (params: FetchAllComboParams)  => {
    return useQuery({
        queryKey: [COMBO_QUERY_KEY, params],
        queryFn: () => getAllCombos(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};