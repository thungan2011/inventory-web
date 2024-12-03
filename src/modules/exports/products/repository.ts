import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import {
    ExportProductDetail,
    ExportProductOverview,
    ExportProductStatus,
    ExportProductType,
} from '@/modules/exports/products/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

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

/**
 * get export Product by Code
 */
const getExportProductByCode = (code: string): Promise<ExportProductDetail> => {
    return httpRepository.get<ExportProductDetail>(`/v1/product_export_receipts/${code}`);
};

export const useImportProductByCode = (code: string) => {
    return useDataFetching(
        [EXPORT_PRODUCT_QUERY_KEY, code],
        () => getExportProductByCode(code),
        { enabled: !!code },
    );
};

/**
 * Create export product
 */
interface AddExportProductPayload {
    type: ExportProductType;
    status: ExportProductStatus;
    note?: string;
}

const createExportProduct = (payload: AddExportProductPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/export/products', payload);
};

export const useCreateExportProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createExportProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [EXPORT_PRODUCT_QUERY_KEY] });
            toast.success('Xuất kho thành phẩm thành công');
        },
        onError: () => {
            toast.error('Xuất kho thành phẩm không thành công. Thử lại sau.');
        },
    });
};