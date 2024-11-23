import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { GroupCustomerOverview } from '@/modules/group-customers/interface';

export const GROUP_CUSTOMER_QUERY_KEY = 'group-customers';
/**
 * get group customer list
 */
const getGroupCustomerList = (): Promise<GroupCustomerOverview[]> => {
    return httpRepository.get<GroupCustomerOverview[]>(`/v1/group_customers/list`);
};

export const useGroupCustomerList = () => {
    return useDataFetching(
        [GROUP_CUSTOMER_QUERY_KEY],
        () => getGroupCustomerList(),
    );
};