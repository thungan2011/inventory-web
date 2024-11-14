import React from 'react';
import { WarehouseAreaMaterialStatus } from '@/modules/warehouse-area/materials/interface';

const statusColors = {
    [WarehouseAreaMaterialStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [WarehouseAreaMaterialStatus.INACTIVE]: 'text-red-600 bg-red-200',

};

export const WarehouseAreaMaterialStatusVietnamese: Record<WarehouseAreaMaterialStatus, string> = {
    [WarehouseAreaMaterialStatus.ACTIVE]: 'Đang hoạt động',
    [WarehouseAreaMaterialStatus.INACTIVE]: 'Không hoạt động',
};

const WarehouseAreaMaterialStatusBadge = ({ status }: { status: WarehouseAreaMaterialStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50 text-nowrap text-xs`}>
            {status === WarehouseAreaMaterialStatus.ACTIVE && 'Đang hoạt động'}
            {status === WarehouseAreaMaterialStatus.INACTIVE && 'Không hoạt động'}
        </span>
    );
};

export default WarehouseAreaMaterialStatusBadge;