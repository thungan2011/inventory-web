import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ImportProductOverview } from '@/modules/imports/products/interface';

export const IMPORT_PRODUCT_QUERY_KEY = 'import_products';

/**
 * Get all Import Products
 */
interface FetchAllImportProductParams {
    page?: number;
}

const getAllImportProducts = (params: FetchAllImportProductParams): Promise<PageObject<ImportProductOverview>> => {
    return httpRepository.get<PageObject<ImportProductOverview>>('/v1/product_import_receipts', {
        page: params.page || 1,
    });
};

export const useAllImportProducts = (params: FetchAllImportProductParams) => {
    return useQuery({
        queryKey: [IMPORT_PRODUCT_QUERY_KEY, params],
        queryFn: () => getAllImportProducts(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};