import {
    District,
    DistrictResponse,
    Province,
    ProvinceResponse,
    Ward,
    WardResponse,
} from '@/modules/provinces/interface';
import useDataFetching from '@/hook/useDataFetching';
import axios from 'axios';

/**
 * get provinces
 */

const getAllProvince = async (): Promise<Province[]> => {
    try {
        const response = await axios.get<ProvinceResponse>('https://vapi.vnappmob.com/api/v2/province/');
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllProvinces = () => {
    return useDataFetching(
        ['provinces'],
        () => getAllProvince(),
    );
};


/**
 * get districts
 */

const getAllDistricts = async (provinceId?: string): Promise<District[]> => {
    try {
        const response = await axios.get<DistrictResponse>(`https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`);
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllDistricts = (provinceId?: string) => {
    return useDataFetching(
        ['districts', provinceId],
        () => getAllDistricts(provinceId),
        {
            enabled: !!provinceId,
        }
    );
};

/**
 * get wards
 */

const getAllWards = async (districtId?: string): Promise<Ward[]> => {
    try {
        const response = await axios.get<WardResponse>(`https://vapi.vnappmob.com/api/v2/province/ward/${districtId}`);
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllWards = (districtId?: string) => {
    return useDataFetching(
        ['wards', districtId],
        () => getAllWards(districtId),
        {
            enabled: !!districtId,
        }
    );
};