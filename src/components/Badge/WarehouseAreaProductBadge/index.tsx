import React from 'react';
import { WarehouseAreaProductStatus } from '@/modules/warehouse-area/products/interface';

const statusColors = {
    [WarehouseAreaProductStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [WarehouseAreaProductStatus.INACTIVE]: 'text-red-600 bg-red-200',

};

export const WarehouseAreaProductStatusVietnamese: Record<WarehouseAreaProductStatus, string> = {
    [WarehouseAreaProductStatus.ACTIVE]: 'Đang hoạt động',
    [WarehouseAreaProductStatus.INACTIVE]: 'Không hoạt động',
};

const WarehouseAreaProductStatusBadge = ({ status }: { status: WarehouseAreaProductStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50 text-xs text-nowrap`}>
            {status === WarehouseAreaProductStatus.ACTIVE && 'Đang hoạt động'}
            {status === WarehouseAreaProductStatus.INACTIVE && 'Không hoạt động'}
        </span>
    );
};

export default WarehouseAreaProductStatusBadge;