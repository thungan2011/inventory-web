import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ExportProductOverview } from '@/modules/exports/products/interface';

export const EXPORT_PRODUCT_QUERY_KEY = 'export_products';

/**
 * Get all Export Product
 */
interface FetchAllExportProductParams {
    page?: number;
}

const getAllExportProducts = (params: FetchAllExportProductParams): Promise<PageObject<ExportProductOverview>> => {
    return httpRepository.get<PageObject<ExportProductOverview>>('/v1/product_export_receipts', {
        page: params.page || 1,
    });
};

export const useAllExportProducts = (params: FetchAllExportProductParams) => {
    return useQuery({
        queryKey: [EXPORT_PRODUCT_QUERY_KEY, params],
        queryFn: () => getAllExportProducts(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};