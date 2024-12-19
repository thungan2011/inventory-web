import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { LoginCredentials, LoginResponse, User } from '@/modules/authentication/interface';
import { useAuth } from '@/hook/useAuth';
import { toast } from 'react-toastify';

/**
 * Login
 */
const loginAsync = (credentials: LoginCredentials): Promise<LoginResponse> => {
    return httpRepository.post<LoginResponse, LoginCredentials>('/v1/auth/login', credentials);
};

export const useLogin = () => {
    const { login } = useAuth();
    return useMutation({
        mutationFn: loginAsync,
        onSuccess: (response) => {
            console.log(response);
            login(response);
        },
    });
};

/**
 * Change password
 */
interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
    user_id: number;
}

interface ChangePasswordResponse {
    message?: string;
    error?: string;
}

const changePassword = (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    return httpRepository.post<ChangePasswordResponse, ChangePasswordPayload>('/v1/auth/change_password', payload);
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (res) => {
            if (res.message) {
                toast.success("Đổi mật khẩu thành công.");
            } else {
                toast.error(res.error);
            }
        },
        onError: () => {
            toast.error("Đã có lỗi xảy ra đổi mật khẩu không thành công");
        }
    });
};

/**
 * Get profile
 */

const getUser = (): Promise<User> => {
    return httpRepository.get<User>('/v1/auth/profile');
};

export const useGetUser = (options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getUser,
        ...options,
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
    });
};