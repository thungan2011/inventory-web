import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { Role } from '@/modules/roles/interface';


export const ROLE_QUERY_KEY = 'roles';

/**
 * get role list
 */
const getRoleList = (): Promise<Role[]> => {
    return httpRepository.get<Role[]>(`/v1/roles/list`);
};

export const useRoleList = () => {
    return useDataFetching(
        [ROLE_QUERY_KEY, 'list'],
        () => getRoleList(),
    );
};