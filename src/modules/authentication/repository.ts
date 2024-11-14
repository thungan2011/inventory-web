import httpRepository from '@/core/repository/http';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { LoginCredentials, LoginResponse, User } from '@/modules/authentication/interface';
import { useAuth } from '@/hook/useAuth';

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