import React from 'react';
import { MaterialStatus } from '@/modules/materials/interface';

const statusColors = {
    [MaterialStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [MaterialStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [MaterialStatus.OUT_OF_STOCK]: 'text-yellow-500 bg-yellow-100',
};

export const MaterialStatusVietnamese: Record<MaterialStatus, string> = {
    [MaterialStatus.ACTIVE]: 'Đang sử dụng',
    [MaterialStatus.INACTIVE]: 'Không sử dụng',
    [MaterialStatus.OUT_OF_STOCK]: 'Hết hàng',
};


const MaterialStatusBadge = ({ status }: { status: MaterialStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === MaterialStatus.INACTIVE && 'Không sử dụng'}
            {status === MaterialStatus.ACTIVE && 'Đang sử dụng'}
            {status === MaterialStatus.OUT_OF_STOCK && 'Hết hàng'}
        </span>
    );
};

export default MaterialStatusBadge;