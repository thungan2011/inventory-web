import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LoginResponse, User } from '@/modules/authentication/interface';
import { useRouter } from 'next/navigation';
import { useGetUser } from '@/modules/authentication/repository';
import { useQueryClient } from '@tanstack/react-query';
import { setAccessTokenForAxios } from '@/core/repository/http';

interface AuthContextType {
    isLoading: boolean;
    accessToken: string;
    refreshToken: string;
    user?: User;
    login: (response: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const storedAccessToken = Cookies.get('accessToken');
        const storedRefreshToken = Cookies.get('refreshToken');
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
            setAccessTokenForAxios(storedAccessToken);
        }
        setIsLoading(false);
    }, []);

    const { data: fetchedUser } = useGetUser({
        enabled: !!accessToken && !user,
    });

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
        }
    }, [fetchedUser]);

    useEffect(() => {
        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);
    }, [accessToken, refreshToken]);

    const login = (response: LoginResponse) => {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response;
        setAccessToken(accessToken);
        setAccessTokenForAxios(accessToken);
        setRefreshToken(refreshToken);

        Cookies.set('accessToken', newAccessToken, { expires: 1 });
        Cookies.set('refreshToken', newRefreshToken, { expires: 14 });
    };

    const logout = () => {
        setAccessToken('');
        setRefreshToken('');
        setUser(undefined);

        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        queryClient.clear();
        router.push('/auth/login');
    };

    const value = {
        isLoading: isLoading,
        accessToken: accessToken || '',
        refreshToken: refreshToken || '',
        login,
        logout,
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext };