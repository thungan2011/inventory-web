import React from 'react';
import { StorageAreaStatus } from '@/modules/storage-area/interface';

const statusColors = {
    [StorageAreaStatus.ACTIVE]: 'text-green-500 bg-green-100',
    [StorageAreaStatus.INACTIVE]: 'text-red-600 bg-red-200',

};

export const StorageAreaStatusVietnamese: Record<StorageAreaStatus, string> = {
    [StorageAreaStatus.ACTIVE]: 'Đang hoạt động',
    [StorageAreaStatus.INACTIVE]: 'Ngưng hoạt động',
};

const StorageAreaStatusBadge = ({ status }: { status: StorageAreaStatus }) => {
    const colorClass = statusColors[status] || 'text-gray-500';

    return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass} bg-opacity-50 text-nowrap text-xs`}>
            {status === StorageAreaStatus.ACTIVE && 'Đang hoạt động'}
            {status === StorageAreaStatus.INACTIVE && 'Ngưng hoạt động'}
        </span>
    );
};

export default StorageAreaStatusBadge;