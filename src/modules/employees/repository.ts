import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmployeeDetail, EmployeeOverview, EmployeeStatus } from '@/modules/employees/interface';
import { toast } from 'react-toastify';
import useDataFetching from '@/hook/useDataFetching';

export const EMPLOYEE_QUERY_KEY = 'employees';

/**
 * Get all employees
 */
interface FetchAllEmployeeParams {
    page?: number;
    first_name?: string;
    status?: EmployeeStatus;
    phone?: string;
}

const getAllEmployees = (params: FetchAllEmployeeParams): Promise<PageObject<EmployeeOverview>> => {
    return httpRepository.get<PageObject<EmployeeOverview>>('/v1/profiles', {...params});
};

export const useAllEmployees = (params: FetchAllEmployeeParams) => {
    return useQuery({
        queryKey: [EMPLOYEE_QUERY_KEY, params],
        queryFn: () => getAllEmployees(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

/**
 * Create employees
 */
interface AddEmployeePayload {
    user_id?: string;
    last_name: string;
    first_name: string;
    birthday?: string;
    avatar?: string;
    gender?: number;
    phone: string;
    password: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    email: string;
    status: EmployeeStatus;
    role_id: number;
}

const createEmployee = (payload: AddEmployeePayload): Promise<void> => {
    console.table(payload);
    return httpRepository.post<void>('/v1/profiles', payload);
};

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmployee,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
            toast.success('Thêm nhân viên thành công');
        },
        onError: () => {
            toast.error('Thêm nhân viên không thành công. Thử lại sau.');
        },
    });
};

/**
 * get employee by ID
 */
const getEmployeeByID = (id: string): Promise<EmployeeDetail> => {
    return httpRepository.get<EmployeeDetail>(`/v1/profiles/${id}`);
};

export const useEmployeeByID = (id: string) => {
    return useDataFetching(
        [EMPLOYEE_QUERY_KEY, id],
        () => getEmployeeByID(id),
        { enabled: !!id },
    );
};