import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryOverview, CategoryType, CategoryWithNameAndType } from '@/modules/categories/interface';
import { BaseStatus } from '@/modules/base/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const CATEGORY_QUERY_KEY = 'categories';

/**
 * Get all categories
 */
interface FetchAllCategoryParams {
    page?: number;
    name: string;
    code: string;
    status?: BaseStatus;
    type?: CategoryType;
}

const getAllCategories = (params: FetchAllCategoryParams): Promise<PageObject<CategoryOverview>> => {
    return httpRepository.get<PageObject<CategoryOverview>>('/v1/categories', {
        page: params.page || 1,
        name: params.name,
        code: params.code,
        status: params.status,
        type: params.type,
    });
};

export const useAllCategories = (params: FetchAllCategoryParams) => {
    return useQuery({
        queryKey: [CATEGORY_QUERY_KEY, params],
        queryFn: () => getAllCategories(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create category
 */
interface AddCategoryPayload {
    name: string;
    status: BaseStatus;
    type: CategoryType;
    description: string;
}

const createCategory = (payload: AddCategoryPayload): Promise<void> => {
    return httpRepository.post<void>('/v1/categories', payload);
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
            toast.success('Thêm danh mục thành công');
        },
        onError: () => {
            toast.error('Thêm danh mục không thành công. Thử lại sau.');
        },
    });
};


/**
 * delete category
 */
const deleteCategory = (id: number): Promise<void> => {
    return httpRepository.delete<void>(`/v1/categories/${id}`);
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        mutationKey: [CATEGORY_QUERY_KEY, 'delete'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
            toast.success('Xóa danh mục thành công');
        },
        onError: () => {
            toast.error('Xóa danh mục không thành công. Thử lại sau.');
        },
    });
};

/**
 * get category list
 */
const getCategoryList = (type?: CategoryType): Promise<CategoryWithNameAndType[]> => {
    return httpRepository.get<CategoryWithNameAndType[]>(`/v1/categories/list`, { type });
};

export const useCategoryList = (type?: CategoryType) => {
    return useDataFetching(
        [CATEGORY_QUERY_KEY],
        () => getCategoryList(type),
    );
};

/**
 * update category
 */
interface UpdateCategoryPayload {
    name: string;
    status: BaseStatus;
    type: CategoryType;
    description: string;
}

const updateCategory = ({id, payload} : {payload: UpdateCategoryPayload, id: number}): Promise<void> => {
    return httpRepository.put<void>(`/v1/categories/${id}`, payload);
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
            toast.success('Cập nhật danh mục thành công');
        },
        onError: () => {
            toast.error('Cập nhật danh mục không thành công. Thử lại sau.');
        },
    });
};