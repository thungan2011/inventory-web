import React from 'react';
import { BaseStatus } from '@/modules/base/interface';

const statusColors = {
    [BaseStatus.INACTIVE]: 'text-red-600 bg-red-200',
    [BaseStatus.ACTIVE]: 'text-green-500 bg-green-100',
};


const BaseStatusBadge = ({ status }: { status: BaseStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium text-nowrap ${colorClass} bg-opacity-50 text-xs`}>
            {status === BaseStatus.INACTIVE && 'Không hoạt động'}
            {status === BaseStatus.ACTIVE && 'Đang hoạt động'}
        </span>
    );
};

export default BaseStatusBadge;