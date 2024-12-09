import httpRepository from '@/core/repository/http';
import useDataFetching from '@/hook/useDataFetching';
import { Report } from '@/modules/reports/interface';


export const REPORT_QUERY_KEY = 'reports';

/**
 * get report stats
 */
const getReport = (): Promise<Report> => {
    return httpRepository.get<Report>(`/v1/reports/stats`);
};

export const useReport = () => {
    return useDataFetching(
        [REPORT_QUERY_KEY, 'stats'],
        () => getReport(),
    );
};