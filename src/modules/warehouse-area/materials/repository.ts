import { PageObject } from '@/core/pagination/interface';
import httpRepository from '@/core/repository/http';
import { useQuery } from '@tanstack/react-query';
import { WarehouseAreaMaterialOverview } from '@/modules/warehouse-area/materials/interface';


export const WAREHOUSE_AREA_MATERIAL_QUERY_KEY = 'warehouse-area-material';

/**
 * Get all Warehouse Areas Material
 */

interface FetchAllWarehouseAreaMaterialParams {
    page?: number;
}

const getAllWarehouseAreaMaterials = (params: FetchAllWarehouseAreaMaterialParams) : Promise<PageObject<WarehouseAreaMaterialOverview>> => {
    return httpRepository.get<PageObject<WarehouseAreaMaterialOverview>>('/v1/material_storage_locations', {
        page: params.page || 1,
    });
};

export const useAllWarehouseAreaMaterials = (params: FetchAllWarehouseAreaMaterialParams)  => {
    return useQuery({
        queryKey: [WAREHOUSE_AREA_MATERIAL_QUERY_KEY, params],
        queryFn: () => getAllWarehouseAreaMaterials(params),
        placeholderData: previousData => previousData,
        staleTime: 5000,
    });
};

