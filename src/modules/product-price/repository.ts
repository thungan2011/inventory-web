import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductPriceOverview, ProductPriceStatus } from '@/modules/product-price/interface';
import { toast } from 'react-toastify';
import { BaseStatus } from '@/modules/base/interface';

export const PRODUCT_PRICE_QUERY_KEY = 'productprice';

/**
 * Get all products price
 */
interface FetchAllProductPriceParams {
    page?: number;
    search: string;
    status?: ProductPriceStatus;
}

const getAllProductsPrice = (params: FetchAllProductPriceParams): Promise<PageObject<ProductPriceOverview>> => {
    return httpRepository.get<PageObject<ProductPriceOverview>>('/v1/product_prices', {
        page: params.page || 1,
        search: params.search,
        status: params.status,
    });
};

export const useAllProductsPrice = (params: FetchAllProductPriceParams) => {
    return useQuery({
        queryKey: [PRODUCT_PRICE_QUERY_KEY, params],
        queryFn: () => getAllProductsPrice(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * delete products price
 */
const deleteProductPrice = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/product_prices/${id}`);
};

export const useDeleteProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProductPrice,
        mutationKey: [PRODUCT_PRICE_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success('Xóa thành công');
        },
        onError: () => {
            toast.error('Xóa không thành công. Thử lại sau.');
        },
    });
};

/**
 * update products price
 */
interface UpdateProductPricePayload {
    dateStart: string;
    dateEnd: string;
    status: ProductPriceStatus;
    price: number;
}

const updateProductPrice = ({id, payload} : {payload: UpdateProductPricePayload, id: number}): Promise<void> => {
    return httpRepository.put<void>(`/v1/product_prices/${id}`, payload);
};

export const useUpdateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success('Cập nhật thành công');
        },
        onError: () => {
            toast.error('Cập nhật không thành công. Thử lại sau.');
        },
    });
};

/**
 * Create product price
 */
interface AddProductPricePayload {
    date_start: string;
    date_end: string;
    status: BaseStatus;
    products: {
        product_id: number;
        price: number;
    }[];
}

const createProductPrice = (payload: AddProductPricePayload): Promise<void> => {
    return httpRepository.post<void>('/v1/product_prices', payload);
};

export const useCreateProductPrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProductPrice,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [PRODUCT_PRICE_QUERY_KEY] });
            toast.success('Thêm bảng giá thành công');
        },
        onError: () => {
            toast.error('Thêm bảng giá không thành công. Thử lại sau.');
        },
    });
};