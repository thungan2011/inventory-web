import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductDetail, ProductOverview, ProductStatus } from '@/modules/products/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const PRODUCT_QUERY_KEY = 'products';

/**
 * Get all products
 */
interface FetchAllProductParams {
    page?: number;
    search: string;
    origin: string;
    packing: string;
    status?: ProductStatus;
}

const getAllProducts = (params: FetchAllProductParams): Promise<PageObject<ProductOverview>> => {
    return httpRepository.get<PageObject<ProductOverview>>('/v1/products', {
        page: params.page || 1,
        search: params.search,
        origin: params.origin,
        packing: params.packing,
        status: params.status,
    });
};

export const useAllProducts = (params: FetchAllProductParams) => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY, params],
        queryFn: () => getAllProducts(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create product
 */
interface AddProductPayload {
    sku?: string;
    name: string;
    category_id: number[];
    origin: string;
    status: ProductStatus;
    weight: number;
    unit: string;
    packing: string;
    usage_time: string;
    description?: string;
    image: string;
    minimum_stock_level: number;
    maximum_stock_level?: number;
}

const createProduct = (payload: AddProductPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/products', payload);
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Thêm sản phẩm thành công');
        },
        onError: () => {
            toast.error('Thêm sản phẩm không thành công. Thử lại sau.');
        },
    });
};

/**
 * delete product
 */
const deleteProduct = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/products/${id}`);
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        mutationKey: [PRODUCT_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Xóa sản phẩm thành công');
        },
        onError: () => {
            toast.error('Xóa không thành công. Thử lại sau.');
        },
    });
};

/**
 * get product by SKU
 */
const getProductBySKU = (sku: string): Promise<ProductDetail> => {
    return httpRepository.get<ProductDetail>(`/v1/products/sku/${sku}`);
};

export const useProductBySKU = (sku: string) => {
    return useDataFetching(
        [PRODUCT_QUERY_KEY, sku],
        () => getProductBySKU(sku),
        {enabled: !!sku}
    );
};

/**
 * update product
 */
interface UpdateProductPayload {
    name: string;
    category_id: number[];
    origin?: string;
    status: ProductStatus;
    weight: number;
    unit: string;
    packing: string;
    usage_time: string;
    description?: string;
    image: string;
    minimum_stock_level?: number;
    maximum_stock_level?: number;
}

const updateProduct = ({id, payload} : {payload: UpdateProductPayload, id: number}): Promise<void> => {
    return httpRepository.put<void>(`/v1/products/${id}`, payload);
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
            toast.success('Cập nhật sản phẩm thành công');
        },
        onError: () => {
            toast.error('Cập nhật sản phẩm không thành công. Thử lại sau.');
        },
    });
};