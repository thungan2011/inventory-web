import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageObject } from '@/core/pagination/interface';
import { ImportProductDetail, ImportProductOverview, ImportProductType } from '@/modules/imports/products/interface';
import useDataFetching from '@/hook/useDataFetching';
import { toast } from 'react-toastify';

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
        { enabled: !!code },
    );
};

/**
 * Create import product
 */
interface AddImportProductPayload {
    sku?: string;
    name: string;
    category_id: number[];
    type: ImportProductType;
    note: string;
}

const createImportProduct = (payload: AddImportProductPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/import/products', payload);
};

export const useCreateImportProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createImportProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [IMPORT_PRODUCT_QUERY_KEY] });
            toast.success('Nhập kho thành phẩm thành công');
        },
        onError: () => {
            toast.error('Nhập kho thành phẩm không thành công. Thử lại sau.');
        },
    });
};