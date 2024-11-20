import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ImportProductDetail, ImportProductOverview } from '@/modules/imports/products/interface';
import useDataFetching from '@/hook/useDataFetching';

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
/**
 * get import product by Code
 */
const getImportProductByCode = (code: string): Promise<ImportProductDetail> => {
    return httpRepository.get<ImportProductDetail>(`/v1/product_import_receipts/${code}`);
};

export const useImportProductByCode = (code: string) => {
    return useDataFetching(
        [IMPORT_PRODUCT_QUERY_KEY, code],
        () => getImportProductByCode(code),
        {enabled: !!code}
    );
};