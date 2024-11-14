import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import CONFIG from '@/config';
import { camelizeKeys } from 'humps';

export const axiosClient: AxiosInstance = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': "application/json",
        Accept: "application/json"
    },
    transformResponse: [
        ...(axios.defaults.transformResponse as any[]),
        (data) => {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    return data;
                }
            }
            return camelizeKeys(data);
        }
    ]
});

let accessToken : string | null = null;

export const setAccessTokenForAxios = (token: string | null) => {
    accessToken = token;
};

axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

class HTTPRepository {
    private handleSuccess<T>(response: AxiosResponse<T>): T {
        console.log('API Success:', response);
        return response.data;
    };

    private handleError(error: AxiosError): never {
        console.log('API Error:', error.response?.data || error.message);
        throw error.response?.data;
    };

    private createSearchParams(params: Record<string, unknown>): URLSearchParams {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => item != null && searchParams.append(key, String(item)));
            } else if (value != null) {
                searchParams.append(key, String(value));
            }
        });
        console.log('searchParams: ', searchParams.toString());
        return searchParams;
    }

    private async request<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosClient.request<T>(config);
            return this.handleSuccess(response);
        } catch (error) {
            return this.handleError(error as AxiosError);
        }
    };

    async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        console.log('params 2',params);
        return this.request<T>({
            method: 'GET',
            url: path,
            params: params ? this.createSearchParams(params) : undefined,
        });
    };

    async post<T, D = any>(path: string, data?: D): Promise<T> {
        return this.request<T>({
            method: 'POST',
            url: path,
            data,
        });
    };

    async put<T, D = any>(path: string, data?: D): Promise<T> {
        return this.request<T>({
            method: 'PUT',
            url: path,
            data,
        });
    }

    async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
        return this.request<T>({
            method: 'DELETE',
            url: path,
            params: params ? this.createSearchParams(params) : undefined,
        });
    }
}

const httpRepository = new HTTPRepository();

export default httpRepository;